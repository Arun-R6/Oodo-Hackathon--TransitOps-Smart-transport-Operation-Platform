package com.transitops.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "fuel_logs")
@Data
public class FuelLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private Trip trip;

    private Double liters;
    private Double cost;
    private LocalDate date;
}
