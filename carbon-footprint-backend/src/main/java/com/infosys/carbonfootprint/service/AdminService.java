package com.infosys.carbonfootprint.service;

import com.infosys.carbonfootprint.dto.*;
import com.infosys.carbonfootprint.entity.UserStatus;

import java.util.List;

public interface AdminService {

    DashboardStatsDto getDashboardStats();

    List<UserSummaryDto> getAllUsers();

    List<UserSummaryDto> getUsersByStatus(UserStatus status);

    UserDetailDto getUserById(Long id);

    UserDetailDto approveUser(Long id);

    UserDetailDto rejectUser(Long id, String remark);
}
