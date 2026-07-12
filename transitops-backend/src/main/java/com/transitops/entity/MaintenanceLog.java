package com.transitops.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_logs")
@Data
public class MaintenanceLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Vehicle vehicle;

    private String description;
    private Double cost;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean closed = false;
}
