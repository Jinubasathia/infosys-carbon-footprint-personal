package com.infosys.carbonfootprint.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.infosys.carbonfootprint.entity.User;
import com.infosys.carbonfootprint.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Getter
@EqualsAndHashCode(of = "id")
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String username;
    private String email;
    @JsonIgnore
    private String password;
    private String firstName;
    private String lastName;
    private UserStatus status;
    private boolean firstLogin;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        String effectiveUsername = user.getUsername() != null ? user.getUsername() : user.getEmail();

        return new UserDetailsImpl(
                user.getId(),
                effectiveUsername,
                user.getEmail(),
                user.getPassword(),
                user.getFirstName(),
                user.getLastName(),
                user.getStatus(),
                user.isFirstLogin(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.REJECTED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == UserStatus.APPROVED || authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
