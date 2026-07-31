package com.infosys.carbonfootprint.dto;

import com.infosys.carbonfootprint.entity.Gender;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Registration DTO combining Personal Details, Address, and Government ID.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequest {

    // --- Personal Details ---
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
    private String lastName;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "User must be at least 18 years old")
    @Max(value = 120, message = "Invalid age")
    private Integer age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Mobile number must be a valid 10-digit Indian phone number")
    private String mobileNumber;

    @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Alternate mobile number must be a valid 10-digit phone number")
    private String alternateMobile;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    // --- Address Details ---
    @NotNull(message = "Address details are required")
    @Valid
    private AddressDto address;

    // --- Government ID Details ---
    @NotNull(message = "Government ID details are required")
    @Valid
    private GovernmentIdDto governmentId;
}
