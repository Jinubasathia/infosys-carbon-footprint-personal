package com.infosys.carbonfootprint.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Role Entity representing application roles (ROLE_ADMIN, ROLE_USER).
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false, unique = true)
    private RoleType name;
}
