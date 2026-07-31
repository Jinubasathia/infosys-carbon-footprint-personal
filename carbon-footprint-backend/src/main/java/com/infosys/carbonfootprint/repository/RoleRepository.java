package com.infosys.carbonfootprint.repository;

import com.infosys.carbonfootprint.entity.Role;
import com.infosys.carbonfootprint.entity.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Role entity operations.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}
