package com.infosys.carbonfootprint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {

    @NotBlank(message = "House number is required")
    private String houseNumber;

    @NotBlank(message = "Street is required")
    private String street;

    @NotBlank(message = "Area is required")
    private String area;

    private String landmark;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "PIN code is required")
    @Pattern(regexp = "^[1-9][0-9]{5}$", message = "PIN code must be a valid 6-digit number")
    private String pinCode;
}
