package com.infosys.carbonfootprint.dto;

import com.infosys.carbonfootprint.entity.IdType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GovernmentIdDto {

    @NotNull(message = "Government ID type is required")
    private IdType idType;

    @NotBlank(message = "Government ID number is required")
    private String idNumber;

    private String documentUrl;
}
