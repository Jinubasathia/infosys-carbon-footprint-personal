package com.infosys.carbonfootprint.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Address Entity normalized to 3NF.
 */
@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "house_number", nullable = false)
    private String houseNumber;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String area;

    private String landmark;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String country;

    @Column(name = "pin_code", nullable = false, length = 10)
    private String pinCode;
}
