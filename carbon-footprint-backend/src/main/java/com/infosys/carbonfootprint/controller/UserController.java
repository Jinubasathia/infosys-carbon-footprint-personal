package com.infosys.carbonfootprint.controller;

import com.infosys.carbonfootprint.dto.UserDetailDto;
import com.infosys.carbonfootprint.response.ApiResponse;
import com.infosys.carbonfootprint.security.UserDetailsImpl;
import com.infosys.carbonfootprint.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller handling User REST endpoints.
 */
@RestController
@RequestMapping("/api/v1/user")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDetailDto>> getCurrentUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserDetailDto profile = userService.getUserProfile(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully", profile));
    }
}
