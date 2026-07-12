package com.transitops.controller;

import com.transitops.entity.Trip;
import com.transitops.service.TripService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    public List<Trip> getAll() { return tripService.getAll(); }

    @GetMapping("/{id}")
    public Trip getById(@PathVariable Long id) { return tripService.getById(id); }

    @PostMapping
    public ResponseEntity<Trip> create(@RequestBody Trip trip) {
        return ResponseEntity.ok(tripService.create(trip));
    }

    @PostMapping("/{id}/dispatch")
    public ResponseEntity<Trip> dispatch(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.dispatch(id));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Trip> complete(@PathVariable Long id, @RequestBody CompleteRequest req) {
        return ResponseEntity.ok(tripService.complete(id, req.getFinalOdometer(), req.getFuelConsumed()));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Trip> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.cancel(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tripService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CompleteRequest {
        private Double finalOdometer;
        private Double fuelConsumed;
    }
}
