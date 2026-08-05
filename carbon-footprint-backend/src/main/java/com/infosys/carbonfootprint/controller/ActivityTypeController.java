package com.infosys.carbonfootprint.controller;

import com.infosys.carbonfootprint.dto.ActivityTypeRequestDto;
import com.infosys.carbonfootprint.dto.ActivityTypeResponseDto;
import com.infosys.carbonfootprint.response.ApiResponse;
import com.infosys.carbonfootprint.service.ActivityTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ActivityTypeController {

    @Autowired
    private ActivityTypeService activityTypeService;

    // Admin Endpoints
    @PostMapping("/admin/activity-types")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ActivityTypeResponseDto>> createActivityType(
            @Valid @RequestBody ActivityTypeRequestDto requestDto,
            Principal principal) {
        String username = principal != null ? principal.getName() : "ADMIN";
        ActivityTypeResponseDto created = activityTypeService.createActivityType(requestDto, username);
        return new ResponseEntity<>(ApiResponse.success("Activity Type created successfully!", created), HttpStatus.CREATED);
    }

    @PutMapping("/admin/activity-types/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ActivityTypeResponseDto>> updateActivityType(
            @PathVariable Long id,
            @Valid @RequestBody ActivityTypeRequestDto requestDto,
            Principal principal) {
        String username = principal != null ? principal.getName() : "ADMIN";
        ActivityTypeResponseDto updated = activityTypeService.updateActivityType(id, requestDto, username);
        return ResponseEntity.ok(ApiResponse.success("Activity Type updated successfully!", updated));
    }

    @DeleteMapping("/admin/activity-types/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteActivityType(@PathVariable Long id) {
        activityTypeService.deleteActivityType(id);
        return ResponseEntity.ok(ApiResponse.success("Activity Type deleted successfully!", null));
    }

    @PatchMapping("/admin/activity-types/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ActivityTypeResponseDto>> toggleActivityTypeStatus(
            @PathVariable Long id,
            Principal principal) {
        String username = principal != null ? principal.getName() : "ADMIN";
        ActivityTypeResponseDto updated = activityTypeService.toggleActivityTypeStatus(id, username);
        return ResponseEntity.ok(ApiResponse.success("Activity Type status updated successfully!", updated));
    }

    @GetMapping("/admin/activity-types")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ActivityTypeResponseDto>>> getAllActivityTypes(
            @RequestParam(required = false) Long categoryId) {
        List<ActivityTypeResponseDto> list = activityTypeService.getAllActivityTypes(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Fetched activity types successfully", list));
    }

    @GetMapping("/admin/activity-types/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ActivityTypeResponseDto>> getActivityTypeById(@PathVariable Long id) {
        ActivityTypeResponseDto dto = activityTypeService.getActivityTypeById(id);
        return ResponseEntity.ok(ApiResponse.success("Activity Type details fetched", dto));
    }

    // User Endpoints
    @GetMapping("/user/activity-types")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ActivityTypeResponseDto>>> getActiveActivityTypes(
            @RequestParam(required = false) Long categoryId) {
        List<ActivityTypeResponseDto> list = activityTypeService.getActiveActivityTypes(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Fetched active activity types", list));
    }
}
