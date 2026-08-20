package com.infosys.carbonfootprint.repository;

import com.infosys.carbonfootprint.entity.CategoryStatus;
import com.infosys.carbonfootprint.entity.EmissionFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmissionFactorRepository extends JpaRepository<EmissionFactor, Long> {
    List<EmissionFactor> findByActivityTypeActivityTypeIdOrderByEffectiveFromDesc(Long activityTypeId);

    @Query("SELECT ef FROM EmissionFactor ef WHERE ef.activityType.activityTypeId = :activityTypeId " +
           "AND ef.status = com.infosys.carbonfootprint.entity.CategoryStatus.ACTIVE AND ef.effectiveFrom <= :date " +
           "AND (ef.effectiveTo IS NULL OR ef.effectiveTo >= :date) " +
           "ORDER BY ef.effectiveFrom DESC")
    Optional<EmissionFactor> findActiveFactorForDate(@Param("activityTypeId") Long activityTypeId,
                                                      @Param("date") LocalDate date);

    List<EmissionFactor> findAllByOrderByCreatedAtDesc();
    List<EmissionFactor> findByStatus(CategoryStatus status);
}
