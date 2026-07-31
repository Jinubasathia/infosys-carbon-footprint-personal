package com.infosys.carbonfootprint.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Government Identification Document Entity normalized to 3NF.
 */
@Entity
@Table(name = "government_ids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovernmentId {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "id_type", nullable = false)
    private IdType idType;

    @Column(name = "id_number", nullable = false)
    private String idNumber;

    @Column(name = "document_url")
    private String documentUrl;
}
