package com.transitops.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleAnalyticsDto {
    private Long vehicleId;
    private String registrationNumber;
    private String name;
    private Double fuelCost;
    private Double maintenanceCost;
    private Double otherExpenses;
    private Double totalOperationalCost;
    private Double totalDistance;
    private Double totalFuelLiters;
    private Double fuelEfficiency;
    private Double acquisitionCost;
    private Double revenue;
    private Double roi;
}
