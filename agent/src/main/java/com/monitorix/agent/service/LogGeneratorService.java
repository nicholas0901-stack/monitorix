package com.monitorix.agent.service;

import com.monitorix.agent.model.LogEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class LogGeneratorService {

    private static final Logger log = LoggerFactory.getLogger(LogGeneratorService.class);
    private final List<LogEntry> recentLogs = new CopyOnWriteArrayList<>();
    private final Random random = new Random();

    private static final List<String> SERVER_IDS = List.of("web-01", "db-01", "cache-01");
    private static final Map<String, String> SERVER_NAMES = Map.of(
        "web-01", "Web Server 01",
        "db-01", "Database Server 01",
        "cache-01", "Cache Server 01"
    );

    private static final List<String> INFO_MESSAGES = List.of(
        "Health check passed",
        "Metrics collected successfully",
        "Connection pool refreshed",
        "Cache warmed up",
        "Backup completed",
        "SSL certificate valid",
        "Scheduled task executed",
        "Config reloaded",
        "New connection established",
        "Request processed in 12ms"
    );

    private static final List<String> WARN_MESSAGES = List.of(
        "High memory usage detected",
        "Slow query detected: 2300ms",
        "Connection pool near capacity",
        "Disk usage above 75%",
        "Response time degraded",
        "Retry attempt 2 of 3",
        "Cache miss rate elevated"
    );

    private static final List<String> ERROR_MESSAGES = List.of(
        "Connection timeout after 5000ms",
        "Failed to reach upstream service",
        "Out of memory error",
        "Disk write failed",
        "Authentication failed for user admin",
        "Database connection lost"
    );

    public void generateLog() {
        String serverId = SERVER_IDS.get(random.nextInt(SERVER_IDS.size()));
        String serverName = SERVER_NAMES.get(serverId);

        int roll = random.nextInt(100);
        String level;
        String message;

        if (roll < 70) {
            level = "INFO";
            message = INFO_MESSAGES.get(random.nextInt(INFO_MESSAGES.size()));
            log.info("[{}] {}", serverName, message);
        } else if (roll < 90) {
            level = "WARN";
            message = WARN_MESSAGES.get(random.nextInt(WARN_MESSAGES.size()));
            log.warn("[{}] {}", serverName, message);
        } else {
            level = "ERROR";
            message = ERROR_MESSAGES.get(random.nextInt(ERROR_MESSAGES.size()));
            log.error("[{}] {}", serverName, message);
        }

        LogEntry entry = LogEntry.builder()
            .id(UUID.randomUUID().toString())
            .level(level)
            .message(message)
            .serverId(serverId)
            .serverName(serverName)
            .source("monitorix-agent")
            .timestamp(Instant.now())
            .build();

        recentLogs.add(0, entry);
        if (recentLogs.size() > 200) recentLogs.remove(recentLogs.size() - 1);
    }

    public List<LogEntry> getRecentLogs(int limit) {
        return recentLogs.subList(0, Math.min(limit, recentLogs.size()));
    }
}