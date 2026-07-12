package com.transitops.controller;

import com.transitops.entity.*;
import com.transitops.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/fuel")
    public List<FuelLog> getAllFuel() { return expenseService.getAllFuelLogs(); }

    @GetMapping("/fuel/vehicle/{vehicleId}")
    public List<FuelLog> getFuelByVehicle(@PathVariable Long vehicleId) {
        return expenseService.getFuelLogsByVehicle(vehicleId);
    }

    @PostMapping("/fuel")
    public ResponseEntity<FuelLog> createFuel(@RequestBody FuelLog log) {
        return ResponseEntity.ok(expenseService.createFuelLog(log));
    }

    @DeleteMapping("/fuel/{id}")
    public ResponseEntity<Void> deleteFuel(@PathVariable Long id) {
        expenseService.deleteFuelLog(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<Expense> getAllExpenses() { return expenseService.getAllExpenses(); }

    @GetMapping("/vehicle/{vehicleId}")
    public List<Expense> getExpensesByVehicle(@PathVariable Long vehicleId) {
        return expenseService.getExpensesByVehicle(vehicleId);
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.createExpense(expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
