package com.transitops.controller;

import com.transitops.dto.DashboardDto;
import com.transitops.dto.VehicleAnalyticsDto;
import com.transitops.service.AnalyticsService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public DashboardDto getDashboard() { return analyticsService.getDashboard(); }

    @GetMapping("/vehicles")
    public List<VehicleAnalyticsDto> getVehicleAnalytics() { return analyticsService.getVehicleAnalytics(); }

    @GetMapping("/export/csv")
    public void exportCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=vehicle-analytics.csv");
        List<VehicleAnalyticsDto> data = analyticsService.getVehicleAnalytics();
        try (CSVPrinter printer = new CSVPrinter(response.getWriter(),
                CSVFormat.DEFAULT.withHeader("Vehicle", "Registration", "Fuel Cost", "Maintenance Cost",
                        "Other Expenses", "Total Cost", "Distance (km)", "Fuel (L)", "Efficiency (km/L)", "ROI (%)"))) {
            for (VehicleAnalyticsDto d : data) {
                printer.printRecord(d.getName(), d.getRegistrationNumber(), d.getFuelCost(),
                        d.getMaintenanceCost(), d.getOtherExpenses(), d.getTotalOperationalCost(),
                        d.getTotalDistance(), d.getTotalFuelLiters(), d.getFuelEfficiency(), d.getRoi());
            }
        }
    }
}
