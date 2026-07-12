package com.transitops.service;

import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Vehicle create(Vehicle vehicle) {
        if (vehicleRepository.existsByRegistrationNumber(vehicle.getRegistrationNumber())) {
            throw new RuntimeException("Registration number already exists: " + vehicle.getRegistrationNumber());
        }
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public Vehicle update(Long id, Vehicle updated) {
        Vehicle existing = getById(id);
        if (!existing.getRegistrationNumber().equals(updated.getRegistrationNumber())
                && vehicleRepository.existsByRegistrationNumber(updated.getRegistrationNumber())) {
            throw new RuntimeException("Registration number already exists");
        }
        existing.setRegistrationNumber(updated.getRegistrationNumber());
        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setMaxLoadCapacity(updated.getMaxLoadCapacity());
        existing.setOdometer(updated.getOdometer());
        existing.setAcquisitionCost(updated.getAcquisitionCost());
        existing.setRegion(updated.getRegion());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        return vehicleRepository.save(existing);
    }

    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }

    public List<Vehicle> getAvailableForDispatch() {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
    }
}
