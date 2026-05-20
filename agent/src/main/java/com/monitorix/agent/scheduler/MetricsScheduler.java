package com.monitorix.agent.scheduler;

import com.monitorix.agent.service.LogGeneratorService;
import com.monitorix.agent.service.MetricsSimulatorService;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class MetricsScheduler {

    private final MetricsSimulatorService metricsService;
    private final LogGeneratorService logService;

    public MetricsScheduler(MetricsSimulatorService metricsService, LogGeneratorService logService) {
        this.metricsService = metricsService;
        this.logService = logService;
    }

    @Scheduled(fixedRate = 10000)
    public void refreshMetrics() {
        metricsService.refreshAllMetrics();
    }

    @Scheduled(fixedRate = 3000)
    public void generateLog() {
        logService.generateLog();
    }
}