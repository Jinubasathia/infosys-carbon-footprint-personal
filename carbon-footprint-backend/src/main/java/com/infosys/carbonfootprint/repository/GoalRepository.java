package com.infosys.carbonfootprint.repository;
import com.infosys.carbonfootprint.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface GoalRepository extends JpaRepository<Goal,Long> { Optional<Goal> findByUserIdAndMonthAndYear(Long userId,Integer month,Integer year); List<Goal> findByUserIdOrderByYearDescMonthDesc(Long userId); }