package com.infosys.carbonfootprint.service.impl;

import com.infosys.carbonfootprint.dto.CategoryRequestDto;
import com.infosys.carbonfootprint.dto.CategoryResponseDto;
import com.infosys.carbonfootprint.entity.Category;
import com.infosys.carbonfootprint.entity.CategoryStatus;
import com.infosys.carbonfootprint.exception.ResourceNotFoundException;
import com.infosys.carbonfootprint.exception.ValidationException;
import com.infosys.carbonfootprint.mapper.CategoryMapper;
import com.infosys.carbonfootprint.repository.CategoryRepository;
import com.infosys.carbonfootprint.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    @Transactional
    public CategoryResponseDto createCategory(CategoryRequestDto dto, String currentUsername) {
        String categoryName = dto.getCategoryName() != null ? dto.getCategoryName().trim() : "";
        if (categoryName.isEmpty()) {
            throw new ValidationException("Category Name cannot be empty");
        }

        if (categoryRepository.existsByCategoryNameIgnoreCase(categoryName)) {
            throw new ValidationException("Category Name must be unique. '" + categoryName + "' already exists.");
        }

        String categoryCode = dto.getCategoryCode() != null ? dto.getCategoryCode().trim().toUpperCase() : "";
        if (categoryCode.isEmpty()) {
            categoryCode = generateCategoryCode(categoryName);
        }

        if (categoryRepository.existsByCategoryCodeIgnoreCase(categoryCode)) {
            throw new ValidationException("Category Code must be unique. '" + categoryCode + "' already exists.");
        }

        Category category = categoryMapper.toEntity(dto);
        category.setCategoryName(categoryName);
        category.setCategoryCode(categoryCode);
        category.setCreatedBy(currentUsername);
        category.setUpdatedBy(currentUsername);

        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CategoryResponseDto updateCategory(Long id, CategoryRequestDto dto, String currentUsername) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        String categoryName = dto.getCategoryName() != null ? dto.getCategoryName().trim() : "";
        if (categoryName.isEmpty()) {
            throw new ValidationException("Category Name cannot be empty");
        }

        if (categoryRepository.existsByCategoryNameIgnoreCaseAndIdNot(categoryName, id)) {
            throw new ValidationException("Category Name must be unique. '" + categoryName + "' is already used by another category.");
        }

        String categoryCode = dto.getCategoryCode() != null ? dto.getCategoryCode().trim().toUpperCase() : category.getCategoryCode();
        if (categoryRepository.existsByCategoryCodeIgnoreCaseAndIdNot(categoryCode, id)) {
            throw new ValidationException("Category Code must be unique. '" + categoryCode + "' is already used by another category.");
        }

        category.setCategoryName(categoryName);
        category.setCategoryCode(categoryCode);
        category.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : category.getDescription());
        category.setIcon(dto.getIcon() != null ? dto.getIcon() : category.getIcon());
        category.setColorCode(dto.getColorCode() != null ? dto.getColorCode() : category.getColorCode());
        category.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : category.getDisplayOrder());
        if (dto.getStatus() != null) {
            category.setStatus(dto.getStatus());
        }
        category.setRemarks(dto.getRemarks() != null ? dto.getRemarks().trim() : category.getRemarks());
        category.setUpdatedBy(currentUsername);

        Category updated = categoryRepository.save(category);
        return categoryMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        categoryRepository.delete(category);
    }

    @Override
    @Transactional
    public CategoryResponseDto toggleCategoryStatus(Long id, String currentUsername) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (category.getStatus() == CategoryStatus.ACTIVE) {
            category.setStatus(CategoryStatus.INACTIVE);
        } else {
            category.setStatus(CategoryStatus.ACTIVE);
        }
        category.setUpdatedBy(currentUsername);

        Category saved = categoryRepository.save(category);
        return categoryMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAscCategoryNameAsc()
                .stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getActiveCategories() {
        return categoryRepository.findByStatusOrderByDisplayOrderAscCategoryNameAsc(CategoryStatus.ACTIVE)
                .stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponseDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return categoryMapper.toDto(category);
    }

    private String generateCategoryCode(String name) {
        String cleanName = name.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        if (cleanName.length() >= 4) {
            return cleanName.substring(0, 4);
        } else if (!cleanName.isEmpty()) {
            return String.format("%-4s", cleanName).replace(' ', 'X');
        }
        return "CAT_" + System.currentTimeMillis() % 10000;
    }
}
