package com.tracker.incidentTracker.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tracker.incidentTracker.Enum.Severity;
import com.tracker.incidentTracker.Enum.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.OffsetDateTime;
import java.util.UUID;

@Table(name = "incidents")
@Entity
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @NotBlank(message ="Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Service is required")
    @Column(nullable = false)
    private String service;

    @NotNull(message = "Severity is required")
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column( nullable = false, name = "severity", columnDefinition = "incident_severity")
    private Severity severity;

    @NotNull
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, name = "status", columnDefinition = "incident_status")
    @Builder.Default
    private Status status= Status.OPEN;

    @Email(message = "Owner must be a valid email address")
    private String owner;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @CreationTimestamp
    @Column(name = "created_at",nullable = false,updatable = false)
    @JsonProperty("createdAt")
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    @JsonProperty("updatedAt")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        if (this.status == null) {
            this.status = Status.OPEN;
        }
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }

}
