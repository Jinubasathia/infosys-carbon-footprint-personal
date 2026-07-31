package com.infosys.carbonfootprint.repository;

import com.infosys.carbonfootprint.entity.Gender;
import com.infosys.carbonfootprint.entity.User;
import com.infosys.carbonfootprint.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity database operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameOrEmail(String username, String email);

    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);

    List<User> findByStatusOrderByCreatedAtDesc(UserStatus status);

    List<User> findAllByOrderByCreatedAtDesc();

    long countByStatus(UserStatus status);

    long countByGender(Gender gender);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'ROLE_USER' ORDER BY u.createdAt DESC")
    List<User> findAllRegisteredUsers();
}
