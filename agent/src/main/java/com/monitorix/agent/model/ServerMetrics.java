package com.monitorix.agent.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServerMetrics {

    private String serverId;
    private String serverName;
    private String status;

    // CPU
    private double cpuUsage;
    private int cpuCores;

    // Memory
    private long memoryUsed;
    private long memoryTotal;
    private double memoryUsagePercent;

    // Disk
    private long diskUsed;
    private long diskTotal;
    private double diskUsagePercent;

    // Network
    private long networkIn;
    private long networkOut;

    // Uptime
    private long uptimeSeconds;

    private Instant timestamp;
}