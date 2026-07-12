package com.transitops.controller;

import com.transitops.entity.Driver;
import com.transitops.service.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @GetMapping
    public List<Driver> getAll() { return driverService.getAll(); }

    @GetMapping("/{id}")
    public Driver getById(@PathVariable Long id) { return driverService.getById(id); }

    @GetMapping("/available")
    public List<Driver> getAvailable() { return driverService.getAvailableForDispatch(); }

    @PostMapping
    public ResponseEntity<Driver> create(@RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.create(driver));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> update(@PathVariable Long id, @RequestBody Driver driver) {
        return ResponseEntity.ok(driverService.update(id, driver));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
