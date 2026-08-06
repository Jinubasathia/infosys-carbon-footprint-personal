package com.infosys.carbonfootprint.service;

import com.infosys.carbonfootprint.dto.CategoryRequestDto;
import com.infosys.carbonfootprint.dto.CategoryResponseDto;

import java.util.List;

public interface CategoryService {

    CategoryResponseDto createCategory(CategoryRequestDto dto, String currentUsername);

    CategoryResponseDto updateCategory(Long id, CategoryRequestDto dto, String currentUsername);

    void deleteCategory(Long id);

    CategoryResponseDto toggleCategoryStatus(Long id, String currentUsername);

    List<CategoryResponseDto> getAllCategories();

    List<CategoryResponseDto> getActiveCategories();

    CategoryResponseDto getCategoryById(Long id);
}
