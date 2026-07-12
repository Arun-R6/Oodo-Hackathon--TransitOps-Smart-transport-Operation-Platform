package com.transitops.service;

import com.transitops.entity.MaintenanceLog;
import com.transitops.entity.Vehicle;
import com.transitops.enums.VehicleStatus;
import com.transitops.repository.MaintenanceLogRepository;
import com.transitops.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public MaintenanceLog create(MaintenanceLog log) {
        Vehicle vehicle = vehicleRepository.findById(log.getVehicle().getId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setStatus(VehicleStatus.IN_SHOP);
        vehicleRepository.save(vehicle);
        log.setClosed(false);
        return maintenanceLogRepository.save(log);
    }

    @Transactional
    public MaintenanceLog close(Long id) {
        MaintenanceLog log = getById(id);
        log.setClosed(true);
        Vehicle vehicle = log.getVehicle();
        if (vehicle.getStatus() != VehicleStatus.RETIRED) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
        }
        return maintenanceLogRepository.save(log);
    }

    public List<MaintenanceLog> getAll() { return maintenanceLogRepository.findAll(); }

    public MaintenanceLog getById(Long id) {
        return maintenanceLogRepository.findById(id).orElseThrow(() -> new RuntimeException("Maintenance log not found"));
    }

    public List<MaintenanceLog> getByVehicle(Long vehicleId) {
        return maintenanceLogRepository.findByVehicleId(vehicleId);
    }

    public void delete(Long id) { maintenanceLogRepository.deleteById(id); }
}
