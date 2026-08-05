package com.infosys.carbonfootprint.config;

import com.infosys.carbonfootprint.entity.*;
import com.infosys.carbonfootprint.repository.RoleRepository;
import com.infosys.carbonfootprint.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * Seeds default roles (ROLE_ADMIN, ROLE_USER) and initial Admin user into PostgreSQL database upon application startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.mail.username}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing database default roles and admin credentials...");

        // 1. Seed ROLE_ADMIN
        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_ADMIN).build()));

        // 2. Seed ROLE_USER
        Role userRole = roleRepository.findByName(RoleType.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_USER).build()));

        // 3. Seed Default Admin user
        if (!userRepository.existsByEmail(adminEmail)) {
            Address adminAddress = Address.builder()
                    .houseNumber("100")
                    .street("Infosys Campus Road")
                    .area("Electronic City")
                    .landmark("Building 4")
                    .city("Bengaluru")
                    .state("Karnataka")
                    .country("India")
                    .pinCode("560100")
                    .build();

            GovernmentId adminGovId = GovernmentId.builder()
                    .idType(IdType.PAN)
                    .idNumber("ADMIN1234F")
                    .build();

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(userRole);

            User admin = User.builder()
                    .username("admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .firstName("System")
                    .lastName("Administrator")
                    .age(35)
                    .gender(Gender.MALE)
                    .dateOfBirth(LocalDate.of(1989, 1, 1))
                    .mobileNumber("9999999999")
                    .status(UserStatus.APPROVED)
                    .firstLogin(false)
                    .address(adminAddress)
                    .governmentId(adminGovId)
                    .roles(roles)
                    .build();

            userRepository.save(admin);
            logger.info("=================================================");
            logger.info(" Default Admin Account Created Successfully!     ");
            logger.info(" Email:    {}", adminEmail);
            logger.info(" Password: {}", adminPassword);
            logger.info("=================================================");
        } else {
            logger.info("Admin account already present in database.");
        }
    }
}
