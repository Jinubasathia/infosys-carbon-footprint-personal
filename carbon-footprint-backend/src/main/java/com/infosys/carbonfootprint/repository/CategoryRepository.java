package com.infosys.carbonfootprint.repository;

import com.infosys.carbonfootprint.entity.Category;
import com.infosys.carbonfootprint.entity.CategoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByCategoryNameIgnoreCase(String categoryName);

    boolean existsByCategoryNameIgnoreCaseAndIdNot(String categoryName, Long id);

    boolean existsByCategoryCodeIgnoreCase(String categoryCode);

    boolean existsByCategoryCodeIgnoreCaseAndIdNot(String categoryCode, Long id);

    List<Category> findByStatusOrderByDisplayOrderAscCategoryNameAsc(CategoryStatus status);

    List<Category> findAllByOrderByDisplayOrderAscCategoryNameAsc();

    Optional<Category> findByCategoryCode(String categoryCode);
}
