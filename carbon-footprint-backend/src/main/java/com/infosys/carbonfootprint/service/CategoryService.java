package com.infosys.carbonfootprint.service;

import com.infosys.carbonfootprint.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    CategoryDto create(CategoryDto dto, String createdBy);
    List<CategoryDto> getAll();
    CategoryDto getById(Long id);
    CategoryDto update(Long id, CategoryDto dto, String updatedBy);
    void delete(Long id);
    CategoryDto activate(Long id, String updatedBy);
    CategoryDto deactivate(Long id, String updatedBy);
    List<CategoryDto> getActiveCategories();
}
