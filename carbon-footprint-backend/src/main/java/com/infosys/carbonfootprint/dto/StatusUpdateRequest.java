package com.infosys.carbonfootprint.dto;

import com.infosys.carbonfootprint.entity.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusUpdateRequest {

    @NotNull(message = "Status is required (APPROVED or REJECTED)")
    private UserStatus status;

    private String remark;
}
