package com.tracker.incidentTracker.DTO;

import com.tracker.incidentTracker.Enum.Severity;
import com.tracker.incidentTracker.Enum.Status;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponseDTO {

    private UUID id;
    private String title;
    private String service;
    private Severity severity;
    private Status status;
    private String owner;
    private String summary;
    private OffsetDateTime createdAt;
}
