package com.infosys.carbonfootprint.service.impl;

import com.infosys.carbonfootprint.dto.*;
import com.infosys.carbonfootprint.entity.*;
import com.infosys.carbonfootprint.repository.*;
import com.infosys.carbonfootprint.exception.ResourceNotFoundException;
import com.infosys.carbonfootprint.service.EmissionAlertGenerationService;
import com.infosys.carbonfootprint.service.GoalService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
public class GoalServiceImpl implements GoalService {
    private final GoalRepository goals;
    private final ActivityLogRepository logs;
    private final UserRepository users;
    private final EmissionAlertGenerationService alertGenerationService;

    public GoalServiceImpl(GoalRepository goals, ActivityLogRepository logs, UserRepository users, EmissionAlertGenerationService alertGenerationService) {
        this.goals = goals; this.logs = logs; this.users = users; this.alertGenerationService = alertGenerationService;
    }

    private double emissions(Long userId, int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1), end = start.plusMonths(1).minusDays(1);
        return logs.findByUserIdAndDateRange(userId, start, end).stream().mapToDouble(ActivityLog::getTotalEmission).sum();
    }

    private GoalDto dto(Goal goal) {
        double current = emissions(goal.getUser().getId(), goal.getMonth(), goal.getYear()), target = goal.getTargetAmount(), pct = current / target * 100;
        String status = current == 0 ? "NOT STARTED" : current > target ? "TARGET EXCEEDED" : pct >= 90 ? "NEAR LIMIT" : "ON TRACK";
        return GoalDto.builder().id(goal.getId()).targetAmount(target).currentEmission(current).remaining(Math.max(0, target - current)).percentageUsed(pct).status(status).month(goal.getMonth()).year(goal.getYear()).updatedAt(goal.getUpdatedAt()).build();
    }

    @Transactional(readOnly = true)
    public GoalDto current(Long userId) {
        LocalDate now = LocalDate.now();
        return goals.findByUserIdAndMonthAndYear(userId, now.getMonthValue(), now.getYear()).map(this::dto).orElse(null);
    }

    @Transactional
    public GoalDto save(Long userId, GoalRequest request) {
        LocalDate now = LocalDate.now();
        Goal goal = goals.findByUserIdAndMonthAndYear(userId, now.getMonthValue(), now.getYear()).orElse(Goal.builder().user(users.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId))).month(now.getMonthValue()).year(now.getYear()).build());
        goal.setTargetAmount(request.getTargetAmount());
        Goal saved = goals.save(goal);
        alertGenerationService.checkCurrentMonthlyGoal(userId);
        return dto(saved);
    }

    @Transactional
    public GoalDto update(Long userId, Long goalId, GoalRequest request) {
        Goal goal = goals.findById(goalId).filter(value -> value.getUser().getId().equals(userId)).orElseThrow(() -> new ResourceNotFoundException("Goal", "id", goalId));
        goal.setTargetAmount(request.getTargetAmount());
        Goal saved = goals.save(goal);
        if (saved.getMonth().equals(LocalDate.now().getMonthValue()) && saved.getYear().equals(LocalDate.now().getYear())) alertGenerationService.checkCurrentMonthlyGoal(userId);
        return dto(saved);
    }

    @Transactional(readOnly = true)
    public List<GoalDto> history(Long userId) { return goals.findByUserIdOrderByYearDescMonthDesc(userId).stream().map(this::dto).toList(); }
}