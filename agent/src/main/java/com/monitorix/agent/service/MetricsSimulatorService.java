package com.monitorix.agent.service;

import com.monitorix.agent.model.Alert;
import com.monitorix.agent.model.ServerMetrics;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class MetricsSimulatorService {

    private final Random random = new Random();
    private final Map<String, ServerMetrics> serverMetrics = new ConcurrentHashMap<>();
    private final List<Alert> alerts = new CopyOnWriteArrayList<>();
    private final Map<String, Double> cpuBaseline = new HashMap<>();
    private final Map<String, Boolean> spikeMode = new ConcurrentHashMap<>();

    private static final List<String> SERVER_IDS = List.of("web-01", "db-01", "cache-01");
    private static final Map<String, Long> START_TIMES = new HashMap<>();

    public MetricsSimulatorService() {
        long now = System.currentTimeMillis() / 1000;
        cpuBaseline.put("web-01", 35.0);
        cpuBaseline.put("db-01", 55.0);
        cpuBaseline.put("cache-01", 25.0);

        spikeMode.put("web-01", false);
        spikeMode.put("db-01", false);
        spikeMode.put("cache-01", false);

        START_TIMES.put("web-01", now - 86400L);
        START_TIMES.put("db-01", now - 172800L);
        START_TIMES.put("cache-01", now - 43200L);

        refreshAllMetrics();
    }

    public void refreshAllMetrics() {
        SERVER_IDS.forEach(this::generateMetrics);
    }

    public void triggerSpike(String serverId) {
        if (SERVER_IDS.contains(serverId)) {
            spikeMode.put(serverId, true);
            generateMetrics(serverId);

            Alert alert = Alert.builder()
                .id(UUID.randomUUID().toString())
                .severity("CRITICAL")
                .title("CPU Spike Detected")
                .message("CPU usage spiked to " + serverMetrics.get(serverId).getCpuUsage() + "% on " + serverId)
                .serverId(serverId)
                .serverName(getServerName(serverId))
                .resolved(false)
                .timestamp(Instant.now())
                .build();

            alerts.add(0, alert);
            if (alerts.size() > 50) alerts.remove(alerts.size() - 1);

            new Timer().schedule(new TimerTask() {
                @Override
                public void run() {
                    spikeMode.put(serverId, false);
                }
            }, 30000);
        }
    }

    private void generateMetrics(String serverId) {
        double baseline = cpuBaseline.get(serverId);
        boolean spike = spikeMode.getOrDefault(serverId, false);

        double cpu = spike
            ? 85.0 + random.nextDouble() * 14
            : Math.min(95, Math.max(5, baseline + (random.nextDouble() * 20) - 10));

        long memTotal = 8L * 1024 * 1024 * 1024;
        double memPercent = spike
            ? 80.0 + random.nextDouble() * 15
            : 40.0 + random.nextDouble() * 35;
        long memUsed = (long)(memTotal * memPercent / 100);

        long diskTotal = 100L * 1024 * 1024 * 1024;
        double diskPercent = 30.0 + random.nextDouble() * 50;
        long diskUsed = (long)(diskTotal * diskPercent / 100);

        long networkIn = (long)(random.nextDouble() * 100 * 1024 * 1024);
        long networkOut = (long)(random.nextDouble() * 50 * 1024 * 1024);

        long uptime = (System.currentTimeMillis() / 1000) - START_TIMES.get(serverId);

        String status = cpu > 90 || memPercent > 90 ? "CRITICAL"
            : cpu > 75 || memPercent > 75 ? "WARNING"
            : "HEALTHY";

        ServerMetrics metrics = ServerMetrics.builder()
            .serverId(serverId)
            .serverName(getServerName(serverId))
            .status(status)
            .cpuUsage(Math.round(cpu * 10.0) / 10.0)
            .cpuCores(4)
            .memoryUsed(memUsed)
            .memoryTotal(memTotal)
            .memoryUsagePercent(Math.round(memPercent * 10.0) / 10.0)
            .diskUsed(diskUsed)
            .diskTotal(diskTotal)
            .diskUsagePercent(Math.round(diskPercent * 10.0) / 10.0)
            .networkIn(networkIn)
            .networkOut(networkOut)
            .uptimeSeconds(uptime)
            .timestamp(Instant.now())
            .build();

        serverMetrics.put(serverId, metrics);

        if (cpu > 80 && !spike) {
            Alert alert = Alert.builder()
                .id(UUID.randomUUID().toString())
                .severity(cpu > 90 ? "CRITICAL" : "WARNING")
                .title("High CPU Usage")
                .message(String.format("CPU at %.1f%% on %s", cpu, getServerName(serverId)))
                .serverId(serverId)
                .serverName(getServerName(serverId))
                .resolved(false)
                .timestamp(Instant.now())
                .build();
            alerts.add(0, alert);
            if (alerts.size() > 50) alerts.remove(alerts.size() - 1);
        }
    }

    private String getServerName(String id) {
        return switch (id) {
            case "web-01" -> "Web Server 01";
            case "db-01" -> "Database Server 01";
            case "cache-01" -> "Cache Server 01";
            default -> id;
        };
    }

    public List<ServerMetrics> getAllMetrics() {
        return new ArrayList<>(serverMetrics.values());
    }

    public ServerMetrics getMetrics(String serverId) {
        return serverMetrics.get(serverId);
    }

    public List<Alert> getAlerts() {
        return new ArrayList<>(alerts);
    }

    public Map<String, Object> getSummary() {
        long healthy = serverMetrics.values().stream()
            .filter(m -> "HEALTHY".equals(m.getStatus())).count();
        long warning = serverMetrics.values().stream()
            .filter(m -> "WARNING".equals(m.getStatus())).count();
        long critical = serverMetrics.values().stream()
            .filter(m -> "CRITICAL".equals(m.getStatus())).count();

        return Map.of(
            "totalServers", serverMetrics.size(),
            "healthy", healthy,
            "warning", warning,
            "critical", critical,
            "activeAlerts", alerts.stream().filter(a -> !a.isResolved()).count(),
            "timestamp", Instant.now()
        );
    }
}