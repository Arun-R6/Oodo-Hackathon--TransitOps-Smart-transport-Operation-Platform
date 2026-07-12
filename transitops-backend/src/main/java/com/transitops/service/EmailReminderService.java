package com.transitops.service;

import com.transitops.entity.Driver;
import com.transitops.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailReminderService {

    private final DriverRepository driverRepository;
    private final JavaMailSender mailSender;

    @Scheduled(cron = "0 0 8 * * *")
    public void sendLicenseExpiryReminders() {
        LocalDate threshold = LocalDate.now().plusDays(30);
        driverRepository.findAll().stream()
                .filter(d -> d.getLicenseExpiry() != null && d.getLicenseExpiry().isBefore(threshold)
                        && d.getLicenseExpiry().isAfter(LocalDate.now()))
                .forEach(this::sendReminder);
    }

    private void sendReminder(Driver driver) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo("admin@transitops.com");
            msg.setSubject("License Expiry Alert: " + driver.getName());
            msg.setText("Driver " + driver.getName() + " (License: " + driver.getLicenseNumber()
                    + ") license expires on " + driver.getLicenseExpiry());
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Could not send email reminder for driver {}: {}", driver.getName(), e.getMessage());
        }
    }
}
