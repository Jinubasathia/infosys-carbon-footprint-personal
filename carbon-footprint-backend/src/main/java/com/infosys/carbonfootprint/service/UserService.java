package com.infosys.carbonfootprint.service;

import com.infosys.carbonfootprint.dto.UserDetailDto;

public interface UserService {

    UserDetailDto getUserProfile(Long userId);

    UserDetailDto getUserProfileByUsername(String username);
}
