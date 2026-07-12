package com.transitops.service;

import com.transitops.entity.Driver;
import com.transitops.enums.DriverStatus;
import com.transitops.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public Driver create(Driver driver) {
        driver.setStatus(DriverStatus.AVAILABLE);
        return driverRepository.save(driver);
    }

    public List<Driver> getAll() {
        return driverRepository.findAll();
    }

    public Driver getById(Long id) {
        return driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    public Driver update(Long id, Driver updated) {
        Driver existing = getById(id);
        existing.setName(updated.getName());
        existing.setLicenseNumber(updated.getLicenseNumber());
        existing.setLicenseCategory(updated.getLicenseCategory());
        existing.setLicenseExpiry(updated.getLicenseExpiry());
        existing.setContactNumber(updated.getContactNumber());
        existing.setSafetyScore(updated.getSafetyScore());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        return driverRepository.save(existing);
    }

    public void delete(Long id) {
        driverRepository.deleteById(id);
    }

    public List<Driver> getAvailableForDispatch() {
        return driverRepository.findByStatus(DriverStatus.AVAILABLE).stream()
                .filter(d -> d.getLicenseExpiry() != null && d.getLicenseExpiry().isAfter(java.time.LocalDate.now()))
                .toList();
    }
}
