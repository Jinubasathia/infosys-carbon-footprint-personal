package com.infosys.carbonfootprint.service.impl;

import com.infosys.carbonfootprint.dto.UserDashboardSummaryDto;
import com.infosys.carbonfootprint.entity.EmissionLimit;
import com.infosys.carbonfootprint.entity.Goal;
import com.infosys.carbonfootprint.repository.ActivityLogRepository;
import com.infosys.carbonfootprint.repository.EmissionLimitRepository;
import com.infosys.carbonfootprint.repository.GoalRepository;
import com.infosys.carbonfootprint.service.UserDashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class UserDashboardServiceImpl implements UserDashboardService {

    private final ActivityLogRepository activityLogRepo;
    private final GoalRepository goalRepo;
    private final EmissionLimitRepository emissionLimitRepo;

    public UserDashboardServiceImpl(ActivityLogRepository activityLogRepo,
                                    GoalRepository goalRepo,
                                    EmissionLimitRepository emissionLimitRepo) {
        this.activityLogRepo = activityLogRepo;
        this.goalRepo = goalRepo;
        this.emissionLimitRepo = emissionLimitRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDashboardSummaryDto getSummary(Long userId) {
        long totalDays = activityLogRepo.countDistinctActivityDatesByUserId(userId);
        boolean hasActivities = totalDays > 0;

        int streak = hasActivities ? calculateStreak(userId) : 0;
        int score = hasActivities ? calculateScore(userId) : 0;
        String status = scoreStatus(score);

        return UserDashboardSummaryDto.builder()
                .trackingStreak(streak)
                .sustainabilityScore(score)
                .sustainabilityStatus(status)
                .hasActivities(hasActivities)
                .build();
    }

    // ── Streak ────────────────────────────────────────────────────────────────
    // Uses LocalDate arithmetic only — no timezone conversion, no timestamps.
    // Counts consecutive calendar days ending at today or yesterday.
    private int calculateStreak(Long userId) {
        List<LocalDate> dates = activityLogRepo.findDistinctActivityDatesByUserId(userId);
        if (dates.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        LocalDate mostRecent = dates.get(0); // already sorted DESC

        // If the most recent activity is older than yesterday, streak is 0
        // (user hasn't logged today or yesterday — streak has broken)
        long gapFromToday = today.toEpochDay() - mostRecent.toEpochDay();
        if (gapFromToday > 1) return 0;

        // Walk backwards through sorted dates counting consecutive days
        int streak = 0;
        LocalDate expected = mostRecent;
        for (LocalDate date : dates) {
            if (date.toEpochDay() == expected.toEpochDay()) {
                streak++;
                expected = expected.minusDays(1);
            } else {
                break; // gap found — streak ends
            }
        }
        return streak;
    }

    // ── Sustainability Score ──────────────────────────────────────────────────
    // Priority 1: use the user's monthly goal if one exists for this month.
    // Priority 2: fall back to sum of all active category emission limits.
    // Score = clamp(100 - (currentEmission / target * 100), 0, 100)
    private int calculateScore(Long userId) {
        LocalDate today = LocalDate.now();
        YearMonth current = YearMonth.now();
        LocalDate monthStart = current.atDay(1);
        LocalDate monthEnd = current.atEndOfMonth();

        double currentEmission = activityLogRepo.sumEmissionByUserIdAndDateRange(userId, monthStart, monthEnd);

        // Try monthly goal first
        Optional<Goal> goalOpt = goalRepo.findByUserIdAndMonthAndYear(userId, today.getMonthValue(), today.getYear());
        if (goalOpt.isPresent()) {
            double target = goalOpt.get().getTargetAmount();
            if (target > 0) {
                double ratio = currentEmission / target;
                return (int) Math.max(0, Math.min(100, Math.round(100 - ratio * 100)));
            }
        }

        // Fall back to sum of active emission limits across all categories
        List<EmissionLimit> limits = emissionLimitRepo.findAll().stream()
                .filter(EmissionLimit::isActive)
                .toList();
        if (!limits.isEmpty()) {
            double totalLimit = limits.stream().mapToDouble(EmissionLimit::getMonthlyLimit).sum();
            if (totalLimit > 0) {
                double ratio = currentEmission / totalLimit;
                return (int) Math.max(0, Math.min(100, Math.round(100 - ratio * 100)));
            }
        }

        // No goal and no limits configured — score based on absolute emission magnitude.
        // Use a simple heuristic: 0 kg = 100, 50 kg = 0 (linear).
        return (int) Math.max(0, Math.min(100, Math.round(100 - currentEmission * 2)));
    }

    private String scoreStatus(int score) {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Needs Improvement";
        return "High Emissions";
    }
}
