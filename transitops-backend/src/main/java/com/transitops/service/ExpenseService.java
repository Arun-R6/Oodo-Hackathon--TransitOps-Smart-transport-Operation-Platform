package com.transitops.service;

import com.transitops.entity.*;
import com.transitops.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRepository expenseRepository;

    public FuelLog createFuelLog(FuelLog log) { return fuelLogRepository.save(log); }
    public List<FuelLog> getAllFuelLogs() { return fuelLogRepository.findAll(); }
    public List<FuelLog> getFuelLogsByVehicle(Long vehicleId) { return fuelLogRepository.findByVehicleId(vehicleId); }
    public void deleteFuelLog(Long id) { fuelLogRepository.deleteById(id); }

    public Expense createExpense(Expense expense) { return expenseRepository.save(expense); }
    public List<Expense> getAllExpenses() { return expenseRepository.findAll(); }
    public List<Expense> getExpensesByVehicle(Long vehicleId) { return expenseRepository.findByVehicleId(vehicleId); }
    public void deleteExpense(Long id) { expenseRepository.deleteById(id); }
}
