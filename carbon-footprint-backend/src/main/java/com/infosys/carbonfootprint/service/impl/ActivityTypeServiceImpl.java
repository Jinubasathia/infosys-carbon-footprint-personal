package com.infosys.carbonfootprint.service.impl;

import com.infosys.carbonfootprint.dto.ActivityTypeRequestDto;
import com.infosys.carbonfootprint.dto.ActivityTypeResponseDto;
import com.infosys.carbonfootprint.entity.ActivityType;
import com.infosys.carbonfootprint.entity.Category;
import com.infosys.carbonfootprint.entity.CategoryStatus;
import com.infosys.carbonfootprint.exception.ResourceNotFoundException;
import com.infosys.carbonfootprint.exception.ValidationException;
import com.infosys.carbonfootprint.mapper.ActivityTypeMapper;
import com.infosys.carbonfootprint.repository.ActivityTypeRepository;
import com.infosys.carbonfootprint.repository.CategoryRepository;
import com.infosys.carbonfootprint.service.ActivityTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityTypeServiceImpl implements ActivityTypeService {

    @Autowired
    private ActivityTypeRepository activityTypeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ActivityTypeMapper activityTypeMapper;

    @Override
    @Transactional
    public ActivityTypeResponseDto createActivityType(ActivityTypeRequestDto dto, String currentUsername) {
        if (dto.getCategoryId() == null) {
            throw new ValidationException("Category is mandatory");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));

        String activityName = dto.getActivityName() != null ? dto.getActivityName().trim() : "";
        if (activityName.isEmpty()) {
            throw new ValidationException("Activity Name is mandatory");
        }

        if (activityTypeRepository.existsByCategoryIdAndActivityNameIgnoreCase(category.getId(), activityName)) {
            throw new ValidationException("Activity Name '" + activityName + "' already exists under category '" + category.getCategoryName() + "'");
        }

        String unit = dto.getUnit() != null ? dto.getUnit().trim() : "";
        if (unit.isEmpty()) {
            throw new ValidationException("Unit is mandatory");
        }

        String activityCode = dto.getActivityCode() != null ? dto.getActivityCode().trim().toUpperCase() : "";
        if (activityCode.isEmpty()) {
            activityCode = generateActivityCode(category.getCategoryCode(), activityName);
        }

        if (activityTypeRepository.existsByActivityCodeIgnoreCase(activityCode)) {
            throw new ValidationException("Activity Code '" + activityCode + "' already exists");
        }

        ActivityType activityType = activityTypeMapper.toEntity(dto, category);
        activityType.setActivityName(activityName);
        activityType.setActivityCode(activityCode);
        activityType.setUnit(unit);
        activityType.setCreatedBy(currentUsername);
        activityType.setUpdatedBy(currentUsername);

        ActivityType saved = activityTypeRepository.save(activityType);
        return activityTypeMapper.toDto(saved);
    }

    @Override
    @Transactional
    public ActivityTypeResponseDto updateActivityType(Long id, ActivityTypeRequestDto dto, String currentUsername) {
        ActivityType activityType = activityTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActivityType", "id", id));

        if (dto.getCategoryId() == null) {
            throw new ValidationException("Category is mandatory");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));

        String activityName = dto.getActivityName() != null ? dto.getActivityName().trim() : "";
        if (activityName.isEmpty()) {
            throw new ValidationException("Activity Name is mandatory");
        }

        if (activityTypeRepository.existsByCategoryIdAndActivityNameIgnoreCaseAndIdNot(category.getId(), activityName, id)) {
            throw new ValidationException("Activity Name '" + activityName + "' already exists under category '" + category.getCategoryName() + "'");
        }

        String unit = dto.getUnit() != null ? dto.getUnit().trim() : "";
        if (unit.isEmpty()) {
            throw new ValidationException("Unit is mandatory");
        }

        String activityCode = dto.getActivityCode() != null ? dto.getActivityCode().trim().toUpperCase() : activityType.getActivityCode();
        if (activityTypeRepository.existsByActivityCodeIgnoreCaseAndIdNot(activityCode, id)) {
            throw new ValidationException("Activity Code '" + activityCode + "' is already used by another activity type");
        }

        activityType.setCategory(category);
        activityType.setActivityCode(activityCode);
        activityType.setActivityName(activityName);
        activityType.setUnit(unit);
        activityType.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : activityType.getDescription());
        activityType.setMinQuantity(dto.getMinQuantity() != null ? dto.getMinQuantity() : activityType.getMinQuantity());
        activityType.setMaxQuantity(dto.getMaxQuantity() != null ? dto.getMaxQuantity() : activityType.getMaxQuantity());
        activityType.setDefaultQuantity(dto.getDefaultQuantity() != null ? dto.getDefaultQuantity() : activityType.getDefaultQuantity());
        activityType.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : activityType.getDisplayOrder());
        activityType.setIcon(dto.getIcon() != null ? dto.getIcon() : activityType.getIcon());
        if (dto.getStatus() != null) {
            activityType.setStatus(dto.getStatus());
        }
        activityType.setRemarks(dto.getRemarks() != null ? dto.getRemarks().trim() : activityType.getRemarks());
        activityType.setUpdatedBy(currentUsername);

        ActivityType updated = activityTypeRepository.save(activityType);
        return activityTypeMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteActivityType(Long id) {
        ActivityType activityType = activityTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActivityType", "id", id));
        activityTypeRepository.delete(activityType);
    }

    @Override
    @Transactional
    public ActivityTypeResponseDto toggleActivityTypeStatus(Long id, String currentUsername) {
        ActivityType activityType = activityTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActivityType", "id", id));

        if (activityType.getStatus() == CategoryStatus.ACTIVE) {
            activityType.setStatus(CategoryStatus.INACTIVE);
        } else {
            activityType.setStatus(CategoryStatus.ACTIVE);
        }
        activityType.setUpdatedBy(currentUsername);

        ActivityType saved = activityTypeRepository.save(activityType);
        return activityTypeMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityTypeResponseDto> getAllActivityTypes(Long categoryId) {
        List<ActivityType> list;
        if (categoryId != null && categoryId > 0) {
            list = activityTypeRepository.findByCategoryIdOrderByDisplayOrderAscActivityNameAsc(categoryId);
        } else {
            list = activityTypeRepository.findAllByOrderByDisplayOrderAscActivityNameAsc();
        }
        return list.stream().map(activityTypeMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityTypeResponseDto> getActiveActivityTypes(Long categoryId) {
        List<ActivityType> list;
        if (categoryId != null && categoryId > 0) {
            list = activityTypeRepository.findByCategoryIdAndStatusOrderByDisplayOrderAscActivityNameAsc(categoryId, CategoryStatus.ACTIVE);
        } else {
            list = activityTypeRepository.findByStatusOrderByDisplayOrderAscActivityNameAsc(CategoryStatus.ACTIVE);
        }
        return list.stream().map(activityTypeMapper::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ActivityTypeResponseDto getActivityTypeById(Long id) {
        ActivityType activityType = activityTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActivityType", "id", id));
        return activityTypeMapper.toDto(activityType);
    }

    private String generateActivityCode(String catCode, String name) {
        String cleanName = name.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        String sub = cleanName.length() >= 4 ? cleanName.substring(0, 4) : String.format("%-4s", cleanName).replace(' ', 'X');
        return catCode + "_" + sub;
    }
}
