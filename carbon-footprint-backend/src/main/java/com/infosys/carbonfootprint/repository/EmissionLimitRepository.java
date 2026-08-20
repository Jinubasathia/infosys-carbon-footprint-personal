package com.infosys.carbonfootprint.repository;
import com.infosys.carbonfootprint.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface EmissionLimitRepository extends JpaRepository<EmissionLimit,Long> { Optional<EmissionLimit> findByCategoryCategoryIdAndActiveTrue(Long categoryId); }