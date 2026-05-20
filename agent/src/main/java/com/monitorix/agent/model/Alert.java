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
public class Alert {

    private String id;
    private String severity;
    private String title;
    private String message;
    private String serverId;
    private String serverName;
    private boolean resolved;
    private Instant timestamp;
}