package com.transitops.controller;

import com.transitops.entity.MaintenanceLog;
import com.transitops.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public List<MaintenanceLog> getAll() { return maintenanceService.getAll(); }

    @GetMapping("/vehicle/{vehicleId}")
    public List<MaintenanceLog> getByVehicle(@PathVariable Long vehicleId) {
        return maintenanceService.getByVehicle(vehicleId);
    }

    @PostMapping
    public ResponseEntity<MaintenanceLog> create(@RequestBody MaintenanceLog log) {
        return ResponseEntity.ok(maintenanceService.create(log));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<MaintenanceLog> close(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.close(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
