package com.infosys.carbonfootprint.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * ActivityType Entity representing specific sub-activities under a Category (e.g., Car, Bus, Veg Meal, Electronics).
 */
@Entity
@Table(name = "activity_types", indexes = {
        @Index(name = "idx_activity_type_code", columnList = "activity_code"),
        @Index(name = "idx_activity_type_category", columnList = "category_id"),
        @Index(name = "idx_activity_type_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_type_id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "activity_code", nullable = false, unique = true, length = 50)
    private String activityCode;

    @Column(name = "activity_name", nullable = false, length = 100)
    private String activityName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 30)
    private String unit;

    @Column(name = "min_quantity")
    private Double minQuantity;

    @Column(name = "max_quantity")
    private Double maxQuantity;

    @Column(name = "default_quantity")
    private Double defaultQuantity;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(length = 50)
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CategoryStatus status = CategoryStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
