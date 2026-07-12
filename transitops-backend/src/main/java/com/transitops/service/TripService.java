package com.transitops.service;

import com.transitops.entity.*;
import com.transitops.enums.*;
import com.transitops.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public Trip create(Trip trip) {
        Vehicle vehicle = vehicleRepository.findById(trip.getVehicle().getId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        Driver driver = driverRepository.findById(trip.getDriver().getId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        validateDispatch(vehicle, driver, trip.getCargoWeight());

        trip.setStatus(TripStatus.DRAFT);
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip dispatch(Long id) {
        Trip trip = getById(id);
        if (trip.getStatus() != TripStatus.DRAFT) throw new RuntimeException("Only DRAFT trips can be dispatched");

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();
        validateDispatch(vehicle, driver, trip.getCargoWeight());

        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setStatus(TripStatus.DISPATCHED);
        trip.setDispatchedAt(LocalDateTime.now());
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip complete(Long id, Double finalOdometer, Double fuelConsumed) {
        Trip trip = getById(id);
        if (trip.getStatus() != TripStatus.DISPATCHED) throw new RuntimeException("Only DISPATCHED trips can be completed");

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        if (finalOdometer != null) {
            trip.setActualDistance(finalOdometer - vehicle.getOdometer());
            vehicle.setOdometer(finalOdometer);
        }
        trip.setFuelConsumed(fuelConsumed);

        vehicle.setStatus(VehicleStatus.AVAILABLE);
        driver.setStatus(DriverStatus.AVAILABLE);
        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(LocalDateTime.now());
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip cancel(Long id) {
        Trip trip = getById(id);
        if (trip.getStatus() == TripStatus.COMPLETED) throw new RuntimeException("Cannot cancel a completed trip");

        if (trip.getStatus() == TripStatus.DISPATCHED) {
            trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
            trip.getDriver().setStatus(DriverStatus.AVAILABLE);
            vehicleRepository.save(trip.getVehicle());
            driverRepository.save(trip.getDriver());
        }

        trip.setStatus(TripStatus.CANCELLED);
        return tripRepository.save(trip);
    }

    public List<Trip> getAll() { return tripRepository.findAll(); }

    public Trip getById(Long id) {
        return tripRepository.findById(id).orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    public void delete(Long id) { tripRepository.deleteById(id); }

    private void validateDispatch(Vehicle vehicle, Driver driver, Double cargoWeight) {
        if (vehicle.getStatus() == VehicleStatus.RETIRED || vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            throw new RuntimeException("Vehicle is not available for dispatch: " + vehicle.getStatus());
        }
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new RuntimeException("Vehicle is already on a trip");
        }
        if (driver.getStatus() == DriverStatus.SUSPENDED) {
            throw new RuntimeException("Driver is suspended");
        }
        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new RuntimeException("Driver is already on a trip");
        }
        if (driver.getLicenseExpiry() == null || !driver.getLicenseExpiry().isAfter(LocalDate.now())) {
            throw new RuntimeException("Driver license is expired");
        }
        if (cargoWeight != null && vehicle.getMaxLoadCapacity() != null
                && cargoWeight > vehicle.getMaxLoadCapacity()) {
            throw new RuntimeException("Cargo weight " + cargoWeight + " kg exceeds vehicle capacity " + vehicle.getMaxLoadCapacity() + " kg");
        }
    }
}
