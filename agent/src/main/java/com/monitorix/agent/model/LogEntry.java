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
public class LogEntry {

    private String id;
    private String level;
    private String message;
    private String serverId;
    private String serverName;
    private String source;
    private Instant timestamp;
}