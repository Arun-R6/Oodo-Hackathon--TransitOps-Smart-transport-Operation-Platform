package com.transitops.service;

import com.transitops.dto.DashboardDto;
import com.transitops.dto.VehicleAnalyticsDto;
import com.transitops.enums.*;
import com.transitops.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;
    private final FuelLogRepository fuelLogRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final ExpenseRepository expenseRepository;

    public DashboardDto getDashboard() {
        long total = vehicleRepository.count();
        long available = vehicleRepository.findByStatus(VehicleStatus.AVAILABLE).size();
        long onTrip = vehicleRepository.findByStatus(VehicleStatus.ON_TRIP).size();
        long inShop = vehicleRepository.findByStatus(VehicleStatus.IN_SHOP).size();
        long activeTrips = tripRepository.findByStatus(TripStatus.DISPATCHED).size();
        long pendingTrips = tripRepository.findByStatus(TripStatus.DRAFT).size();
        long driversOnDuty = driverRepository.findByStatus(DriverStatus.ON_TRIP).size();
        double utilization = total > 0 ? (double) onTrip / total * 100 : 0;

        return DashboardDto.builder()
                .totalVehicles(total)
                .activeVehicles(onTrip)
                .availableVehicles(available)
                .vehiclesInMaintenance(inShop)
                .activeTrips(activeTrips)
                .pendingTrips(pendingTrips)
                .driversOnDuty(driversOnDuty)
                .fleetUtilization(Math.round(utilization * 10.0) / 10.0)
                .totalDrivers(driverRepository.count())
                .build();
    }

    public List<VehicleAnalyticsDto> getVehicleAnalytics() {
        return vehicleRepository.findAll().stream().map(v -> {
            Double fuelCost = fuelLogRepository.sumCostByVehicleId(v.getId());
            Double fuelLiters = fuelLogRepository.sumLitersByVehicleId(v.getId());
            Double maintenanceCost = maintenanceLogRepository.findByVehicleId(v.getId())
                    .stream().mapToDouble(m -> m.getCost() != null ? m.getCost() : 0).sum();
            Double otherExpenses = expenseRepository.sumAmountByVehicleId(v.getId());
            Double totalCost = fuelCost + maintenanceCost + otherExpenses;

            Double totalDistance = tripRepository.findByVehicleId(v.getId()).stream()
                    .filter(t -> t.getActualDistance() != null)
                    .mapToDouble(t -> t.getActualDistance()).sum();

            Double efficiency = (fuelLiters != null && fuelLiters > 0) ? totalDistance / fuelLiters : 0;
            Double revenue = totalDistance * 2.5; // estimated revenue per km
            Double roi = (v.getAcquisitionCost() != null && v.getAcquisitionCost() > 0)
                    ? (revenue - totalCost) / v.getAcquisitionCost() * 100 : 0;

            return VehicleAnalyticsDto.builder()
                    .vehicleId(v.getId())
                    .registrationNumber(v.getRegistrationNumber())
                    .name(v.getName())
                    .fuelCost(fuelCost)
                    .maintenanceCost(maintenanceCost)
                    .otherExpenses(otherExpenses)
                    .totalOperationalCost(totalCost)
                    .totalDistance(totalDistance)
                    .totalFuelLiters(fuelLiters)
                    .fuelEfficiency(Math.round(efficiency * 100.0) / 100.0)
                    .acquisitionCost(v.getAcquisitionCost())
                    .revenue(revenue)
                    .roi(Math.round(roi * 100.0) / 100.0)
                    .build();
        }).toList();
    }
}
