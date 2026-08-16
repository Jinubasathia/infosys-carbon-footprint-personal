package com.infosys.carbonfootprint.repository;

import com.infosys.carbonfootprint.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findAllByOrderByActivityDateDescCreatedAtDesc();

    List<ActivityLog> findByUserIdOrderByActivityDateDescCreatedAtDesc(Long userId);

    Optional<ActivityLog> findByActivityLogIdAndUserId(Long logId, Long userId);

    @Query("SELECT a FROM ActivityLog a WHERE a.user.id = :userId " +
           "AND (:categoryId IS NULL OR a.category.categoryId = :categoryId) " +
           "AND (:activityTypeId IS NULL OR a.activityType.activityTypeId = :activityTypeId) " +
           "AND (:fromDate IS NULL OR a.activityDate >= :fromDate) " +
           "AND (:toDate IS NULL OR a.activityDate <= :toDate) " +
           "ORDER BY a.activityDate DESC, a.createdAt DESC")
    List<ActivityLog> findFiltered(@Param("userId") Long userId,
                                   @Param("categoryId") Long categoryId,
                                   @Param("activityTypeId") Long activityTypeId,
                                   @Param("fromDate") LocalDate fromDate,
                                   @Param("toDate") LocalDate toDate);
}
