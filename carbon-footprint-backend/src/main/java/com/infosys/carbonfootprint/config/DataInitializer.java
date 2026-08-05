package com.infosys.carbonfootprint.config;

import com.infosys.carbonfootprint.entity.*;
import com.infosys.carbonfootprint.repository.ActivityTypeRepository;
import com.infosys.carbonfootprint.repository.CategoryRepository;
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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Seeds default roles (ROLE_ADMIN, ROLE_USER), initial Admin user, default Categories, and Activity Types into PostgreSQL database upon application startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ActivityTypeRepository activityTypeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@infosys.com}")
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

        // 4. Seed Default Categories (Milestone 2 - Module 1)
        seedCategories();

        // 5. Seed Default Activity Types (Milestone 2 - Module 2)
        seedActivityTypes();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            logger.info("Seeding default categories for Milestone 2...");
            List<Category> defaultCategories = List.of(
                    Category.builder()
                            .categoryCode("TRANS")
                            .categoryName("Transport")
                            .description("Transport & Mobility activities including vehicle travel, public transit, and flights.")
                            .icon("Car")
                            .colorCode("#3B82F6")
                            .displayOrder(1)
                            .status(CategoryStatus.ACTIVE)
                            .remarks("Default system category for transport activities")
                            .createdBy("SYSTEM")
                            .build(),
                    Category.builder()
                            .categoryCode("ELEC")
                            .categoryName("Electricity")
                            .description("Electricity and household energy consumption.")
                            .icon("Zap")
                            .colorCode("#F59E0B")
                            .displayOrder(2)
                            .status(CategoryStatus.ACTIVE)
                            .remarks("Default system category for electricity activities")
                            .createdBy("SYSTEM")
                            .build(),
                    Category.builder()
                            .categoryCode("FOOD")
                            .categoryName("Food")
                            .description("Food & dietary footprint including meals and dietary choices.")
                            .icon("Utensils")
                            .colorCode("#10B981")
                            .displayOrder(3)
                            .status(CategoryStatus.ACTIVE)
                            .remarks("Default system category for food activities")
                            .createdBy("SYSTEM")
                            .build(),
                    Category.builder()
                            .categoryCode("SHOP")
                            .categoryName("Shopping")
                            .description("Shopping, goods, and consumer product purchases.")
                            .icon("ShoppingBag")
                            .colorCode("#EC4899")
                            .displayOrder(4)
                            .status(CategoryStatus.ACTIVE)
                            .remarks("Default system category for shopping activities")
                            .createdBy("SYSTEM")
                            .build()
            );

            categoryRepository.saveAll(defaultCategories);
            logger.info("Successfully seeded 4 default categories (Transport, Electricity, Food, Shopping).");
        } else {
            logger.info("Categories already exist in database.");
        }
    }

    private void seedActivityTypes() {
        if (activityTypeRepository.count() == 0) {
            logger.info("Seeding default Activity Types for Milestone 2...");
            List<ActivityType> activityTypes = new ArrayList<>();

            categoryRepository.findByCategoryCode("TRANS").ifPresent(cat -> {
                activityTypes.add(ActivityType.builder().category(cat).activityCode("TRANS_CAR").activityName("Car").description("Personal car travel").unit("km").minQuantity(0.1).maxQuantity(5000.0).defaultQuantity(10.0).displayOrder(1).icon("Car").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("TRANS_BUS").activityName("Bus").description("Public bus transit").unit("km").minQuantity(0.1).maxQuantity(2000.0).defaultQuantity(5.0).displayOrder(2).icon("Bus").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("TRANS_BIKE").activityName("Bike").description("Motorbike or scooter travel").unit("km").minQuantity(0.1).maxQuantity(1000.0).defaultQuantity(5.0).displayOrder(3).icon("Bike").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("TRANS_METRO").activityName("Metro").description("Subway / Metro train transit").unit("km").minQuantity(0.1).maxQuantity(1000.0).defaultQuantity(5.0).displayOrder(4).icon("Train").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("TRANS_FLIGHT").activityName("Flight").description("Air travel").unit("km").minQuantity(1.0).maxQuantity(50000.0).defaultQuantity(500.0).displayOrder(5).icon("Plane").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
            });

            categoryRepository.findByCategoryCode("ELEC").ifPresent(cat -> {
                activityTypes.add(ActivityType.builder().category(cat).activityCode("ELEC_GRID").activityName("Grid Electricity").description("Grid electricity consumption").unit("kWh").minQuantity(0.1).maxQuantity(10000.0).defaultQuantity(10.0).displayOrder(1).icon("Zap").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("ELEC_SOLAR").activityName("Solar Power").description("Solar renewable energy usage").unit("kWh").minQuantity(0.1).maxQuantity(10000.0).defaultQuantity(10.0).displayOrder(2).icon("Sun").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("ELEC_GEN").activityName("Generator (Diesel)").description("Diesel power generator").unit("Liters").minQuantity(0.1).maxQuantity(1000.0).defaultQuantity(5.0).displayOrder(3).icon("Flame").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
            });

            categoryRepository.findByCategoryCode("FOOD").ifPresent(cat -> {
                activityTypes.add(ActivityType.builder().category(cat).activityCode("FOOD_VEG").activityName("Veg Meal").description("Vegetarian meal").unit("meals").minQuantity(1.0).maxQuantity(20.0).defaultQuantity(1.0).displayOrder(1).icon("Utensils").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("FOOD_CHICKEN").activityName("Chicken Meal").description("Poultry / Chicken meal").unit("meals").minQuantity(1.0).maxQuantity(20.0).defaultQuantity(1.0).displayOrder(2).icon("Utensils").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("FOOD_BEEF").activityName("Beef Meal").description("Red meat / Beef meal").unit("meals").minQuantity(1.0).maxQuantity(20.0).defaultQuantity(1.0).displayOrder(3).icon("Utensils").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("FOOD_VEGAN").activityName("Vegan Meal").description("Plant-based vegan meal").unit("meals").minQuantity(1.0).maxQuantity(20.0).defaultQuantity(1.0).displayOrder(4).icon("Utensils").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
            });

            categoryRepository.findByCategoryCode("SHOP").ifPresent(cat -> {
                activityTypes.add(ActivityType.builder().category(cat).activityCode("SHOP_ELEC").activityName("Electronics").description("Electronic gadgets & appliances").unit("items").minQuantity(1.0).maxQuantity(50.0).defaultQuantity(1.0).displayOrder(1).icon("ShoppingBag").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("SHOP_CLOTH").activityName("Clothes").description("Apparel & garments").unit("items").minQuantity(1.0).maxQuantity(100.0).defaultQuantity(1.0).displayOrder(2).icon("ShoppingBag").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
                activityTypes.add(ActivityType.builder().category(cat).activityCode("SHOP_FURN").activityName("Furniture").description("Home / office furniture").unit("items").minQuantity(1.0).maxQuantity(20.0).defaultQuantity(1.0).displayOrder(3).icon("Home").status(CategoryStatus.ACTIVE).createdBy("SYSTEM").build());
            });

            if (!activityTypes.isEmpty()) {
                activityTypeRepository.saveAll(activityTypes);
                logger.info("Successfully seeded {} default Activity Types.", activityTypes.size());
            }
        } else {
            logger.info("Activity Types already exist in database.");
        }
    }
}
