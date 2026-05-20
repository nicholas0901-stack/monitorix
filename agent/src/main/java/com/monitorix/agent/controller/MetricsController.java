package com.monitorix.agent.controller;

import com.monitorix.agent.model.Alert;
import com.monitorix.agent.model.LogEntry;
import com.monitorix.agent.model.ServerMetrics;
import com.monitorix.agent.service.LogGeneratorService;
import com.monitorix.agent.service.MetricsSimulatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MetricsController {

    private final MetricsSimulatorService metricsService;
    private final LogGeneratorService logService;

    public MetricsController(MetricsSimulatorService metricsService, LogGeneratorService logService) {
        this.metricsService = metricsService;
        this.logService = logService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(metricsService.getSummary());
    }

    @GetMapping("/servers")
    public ResponseEntity<List<ServerMetrics>> getAllServers() {
        return ResponseEntity.ok(metricsService.getAllMetrics());
    }

    @GetMapping("/servers/{serverId}")
    public ResponseEntity<ServerMetrics> getServer(@PathVariable String serverId) {
        ServerMetrics metrics = metricsService.getMetrics(serverId);
        if (metrics == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Alert>> getAlerts() {
        return ResponseEntity.ok(metricsService.getAlerts());
    }

    @PostMapping("/servers/{serverId}/spike")
    public ResponseEntity<Map<String, String>> triggerSpike(@PathVariable String serverId) {
        metricsService.triggerSpike(serverId);
        return ResponseEntity.ok(Map.of(
            "message", "CPU spike triggered on " + serverId,
            "duration", "30 seconds"
        ));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<LogEntry>> getLogs(
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(logService.getRecentLogs(limit));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "monitorix-agent"
        ));
    }
}