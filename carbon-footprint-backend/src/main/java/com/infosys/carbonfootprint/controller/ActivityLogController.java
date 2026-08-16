package com.infosys.carbonfootprint.controller;

import com.infosys.carbonfootprint.dto.ActivityLogDto;
import com.infosys.carbonfootprint.response.ApiResponse;
import com.infosys.carbonfootprint.security.UserDetailsImpl;
import com.infosys.carbonfootprint.service.ActivityLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user/activities")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class ActivityLogController {

    @Autowired private ActivityLogService activityLogService;

    @PostMapping
    public ResponseEntity<ApiResponse<ActivityLogDto>> create(
            @Valid @RequestBody ActivityLogDto dto,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return new ResponseEntity<>(ApiResponse.success("Activity logged successfully",
                activityLogService.create(dto, user.getId())), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getAll(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ApiResponse.success("Activities fetched",
                activityLogService.getByUser(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ActivityLogDto>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ApiResponse.success("Activity fetched",
                activityLogService.getById(id, user.getId())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ActivityLogDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody ActivityLogDto dto,
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ApiResponse.success("Activity updated successfully",
                activityLogService.update(id, dto, user.getId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl user) {
        activityLogService.delete(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Activity deleted successfully"));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> filter(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long activityTypeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(ApiResponse.success("Activities filtered",
                activityLogService.filter(user.getId(), categoryId, activityTypeId, fromDate, toDate)));
    }
}
