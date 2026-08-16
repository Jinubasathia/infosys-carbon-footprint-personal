package com.infosys.carbonfootprint.service.impl;

import com.infosys.carbonfootprint.dto.CategoryDto;
import com.infosys.carbonfootprint.entity.Category;
import com.infosys.carbonfootprint.entity.CategoryStatus;
import com.infosys.carbonfootprint.exception.ResourceNotFoundException;
import com.infosys.carbonfootprint.exception.ValidationException;
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

    @Override
    @Transactional
    public CategoryDto create(CategoryDto dto, String createdBy) {
        if (categoryRepository.existsByCategoryNameIgnoreCase(dto.getCategoryName()))
            throw new ValidationException("Category name '" + dto.getCategoryName() + "' already exists");
        if (categoryRepository.existsByCategoryCodeIgnoreCase(dto.getCategoryCode()))
            throw new ValidationException("Category code '" + dto.getCategoryCode() + "' already exists");

        Category category = Category.builder()
                .categoryCode(dto.getCategoryCode().toUpperCase())
                .categoryName(dto.getCategoryName())
                .description(dto.getDescription())
                .icon(dto.getIcon())
                .colorCode(dto.getColorCode())
                .displayOrder(dto.getDisplayOrder())
                .status(dto.getStatus() != null ? dto.getStatus() : CategoryStatus.ACTIVE)
                .remarks(dto.getRemarks())
                .createdBy(createdBy)
                .build();

        return toDto(categoryRepository.save(category));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAll() {
        return categoryRepository.findAllByOrderByDisplayOrderAscCategoryNameAsc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getById(Long id) {
        return toDto(findOrThrow(id));
    }

    @Override
    @Transactional
    public CategoryDto update(Long id, CategoryDto dto, String updatedBy) {
        Category category = findOrThrow(id);

        if (categoryRepository.existsByCategoryNameIgnoreCaseAndCategoryIdNot(dto.getCategoryName(), id))
            throw new ValidationException("Category name '" + dto.getCategoryName() + "' already exists");
        if (categoryRepository.existsByCategoryCodeIgnoreCaseAndCategoryIdNot(dto.getCategoryCode(), id))
            throw new ValidationException("Category code '" + dto.getCategoryCode() + "' already exists");

        category.setCategoryCode(dto.getCategoryCode().toUpperCase());
        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        category.setIcon(dto.getIcon());
        category.setColorCode(dto.getColorCode());
        category.setDisplayOrder(dto.getDisplayOrder());
        category.setStatus(dto.getStatus());
        category.setRemarks(dto.getRemarks());
        category.setUpdatedBy(updatedBy);

        return toDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category category = findOrThrow(id);
        if (!category.getActivityTypes().isEmpty())
            throw new ValidationException("Cannot delete category with existing activity types. Deactivate it instead.");
        categoryRepository.delete(category);
    }

    @Override
    @Transactional
    public CategoryDto activate(Long id, String updatedBy) {
        Category category = findOrThrow(id);
        category.setStatus(CategoryStatus.ACTIVE);
        category.setUpdatedBy(updatedBy);
        return toDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryDto deactivate(Long id, String updatedBy) {
        Category category = findOrThrow(id);
        category.setStatus(CategoryStatus.INACTIVE);
        category.setUpdatedBy(updatedBy);
        return toDto(categoryRepository.save(category));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByStatus(CategoryStatus.ACTIVE)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    private Category findOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    private CategoryDto toDto(Category c) {
        return CategoryDto.builder()
                .categoryId(c.getCategoryId())
                .categoryCode(c.getCategoryCode())
                .categoryName(c.getCategoryName())
                .description(c.getDescription())
                .icon(c.getIcon())
                .colorCode(c.getColorCode())
                .displayOrder(c.getDisplayOrder())
                .status(c.getStatus())
                .remarks(c.getRemarks())
                .createdBy(c.getCreatedBy())
                .updatedBy(c.getUpdatedBy())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
