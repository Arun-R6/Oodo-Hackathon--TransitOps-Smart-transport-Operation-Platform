package com.transitops.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardDto {
    private long activeVehicles;
    private long availableVehicles;
    private long vehiclesInMaintenance;
    private long activeTrips;
    private long pendingTrips;
    private long driversOnDuty;
    private double fleetUtilization;
    private long totalVehicles;
    private long totalDrivers;
}
