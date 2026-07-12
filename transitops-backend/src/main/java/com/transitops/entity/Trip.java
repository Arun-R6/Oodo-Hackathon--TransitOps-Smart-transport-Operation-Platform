package com.transitops.entity;

import com.transitops.enums.TripStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Data
public class Trip {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;
    private Double cargoWeight;
    private Double plannedDistance;
    private Double actualDistance;
    private Double fuelConsumed;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    private Driver driver;

    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.DRAFT;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime dispatchedAt;
    private LocalDateTime completedAt;
}
