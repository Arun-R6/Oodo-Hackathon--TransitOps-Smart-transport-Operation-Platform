package com.transitops.entity;

import com.transitops.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "vehicles")
@Data
public class Vehicle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String registrationNumber;

    private String name;
    private String type;
    private Double maxLoadCapacity;
    private Double odometer;
    private Double acquisitionCost;
    private String region;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.AVAILABLE;
}
