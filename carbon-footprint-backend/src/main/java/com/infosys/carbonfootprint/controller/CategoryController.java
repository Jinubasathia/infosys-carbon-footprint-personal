package com.infosys.carbonfootprint.controller;

import com.infosys.carbonfootprint.dto.CategoryRequestDto;
import com.infosys.carbonfootprint.dto.CategoryResponseDto;
import com.infosys.carbonfootprint.response.ApiResponse;
import com.infosys.carbonfootprint.service.CategoryService;
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
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Admin Endpoints
    @PostMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> createCategory(
            @Valid @RequestBody CategoryRequestDto requestDto,
            Principal principal) {
        String username = principal != null ? principal.getName() : "ADMIN";
        CategoryResponseDto created = categoryService.createCategory(requestDto, username);
        return new ResponseEntity<>(ApiResponse.success("Category created successfully!", created), HttpStatus.CREATED);
    }

    @PutMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDto requestDto,
            Principal principal) {
        String username = principal != null ? principal.getName() : "ADMIN";
        CategoryResponseDto updated = categoryService.updateCategory(id, requestDto, username);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully!", updated));
    }

    @DeleteMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully!", null));
    }

    @PatchMapping("/admin/categories/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> toggleCategoryStatus(
            @PathVariable Long id,
            Principal principal) {
        String username = principal != null ? principal.getName() : "ADMIN";
        CategoryResponseDto updated = categoryService.toggleCategoryStatus(id, username);
        return ResponseEntity.ok(ApiResponse.success("Category status updated successfully!", updated));
    }

    @GetMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getAllCategories() {
        List<CategoryResponseDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Fetched all categories successfully", categories));
    }

    @GetMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> getCategoryById(@PathVariable Long id) {
        CategoryResponseDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category details fetched", category));
    }

    // User Endpoints
    @GetMapping("/user/categories")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getActiveCategories() {
        List<CategoryResponseDto> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.success("Fetched active categories", categories));
    }
}
