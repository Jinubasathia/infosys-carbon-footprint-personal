package com.infosys.carbonfootprint.repository;

import com.infosys.carbonfootprint.entity.ActivityType;
import com.infosys.carbonfootprint.entity.CategoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityTypeRepository extends JpaRepository<ActivityType, Long> {

    List<ActivityType> findByCategoryIdOrderByDisplayOrderAscActivityNameAsc(Long categoryId);

    List<ActivityType> findByCategoryIdAndStatusOrderByDisplayOrderAscActivityNameAsc(Long categoryId, CategoryStatus status);

    List<ActivityType> findByStatusOrderByDisplayOrderAscActivityNameAsc(CategoryStatus status);

    List<ActivityType> findAllByOrderByDisplayOrderAscActivityNameAsc();

    boolean existsByActivityCodeIgnoreCase(String activityCode);

    boolean existsByActivityCodeIgnoreCaseAndIdNot(String activityCode, Long id);

    boolean existsByCategoryIdAndActivityNameIgnoreCase(Long categoryId, String activityName);

    boolean existsByCategoryIdAndActivityNameIgnoreCaseAndIdNot(Long categoryId, String activityName, Long id);

    Optional<ActivityType> findByActivityCode(String activityCode);
}
