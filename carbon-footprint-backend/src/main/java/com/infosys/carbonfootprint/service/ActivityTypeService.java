package com.infosys.carbonfootprint.service;

import com.infosys.carbonfootprint.dto.ActivityTypeDto;
import java.util.List;

public interface ActivityTypeService {
    ActivityTypeDto create(ActivityTypeDto dto, String createdBy);
    List<ActivityTypeDto> getAll();
    List<ActivityTypeDto> getByCategory(Long categoryId);
    List<ActivityTypeDto> getActiveByCategoryId(Long categoryId);
    ActivityTypeDto getById(Long id);
    ActivityTypeDto update(Long id, ActivityTypeDto dto, String updatedBy);
    void delete(Long id);
}
