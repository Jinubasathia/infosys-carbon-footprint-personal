package com.infosys.carbonfootprint.service;

import com.infosys.carbonfootprint.dto.ActivityTypeRequestDto;
import com.infosys.carbonfootprint.dto.ActivityTypeResponseDto;

import java.util.List;

public interface ActivityTypeService {

    ActivityTypeResponseDto createActivityType(ActivityTypeRequestDto dto, String currentUsername);

    ActivityTypeResponseDto updateActivityType(Long id, ActivityTypeRequestDto dto, String currentUsername);

    void deleteActivityType(Long id);

    ActivityTypeResponseDto toggleActivityTypeStatus(Long id, String currentUsername);

    List<ActivityTypeResponseDto> getAllActivityTypes(Long categoryId);

    List<ActivityTypeResponseDto> getActiveActivityTypes(Long categoryId);

    ActivityTypeResponseDto getActivityTypeById(Long id);
}
