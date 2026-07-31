package com.infosys.carbonfootprint.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {

    private long totalUsers;
    private long pendingUsers;
    private long approvedUsers;
    private long rejectedUsers;
    private long maleCount;
    private long femaleCount;
    private long otherGenderCount;
    private List<UserSummaryDto> recentRegistrations;
}
