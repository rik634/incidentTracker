package com.tracker.incidentTracker.DTO;

import com.tracker.incidentTracker.Enum.Severity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Service is required")
    private String service;

    @NotNull(message = "Severity is required")
    private Severity severity;

    @Email(message = "Owner must be a valid email address")
    private String owner;

    private String summary;
}
