package com.tracker.incidentTracker.Service;

import com.tracker.incidentTracker.DTO.IncidentRequestDTO;
import com.tracker.incidentTracker.DTO.IncidentResponseDTO;
import com.tracker.incidentTracker.Entity.Incident;
import com.tracker.incidentTracker.Enum.Severity;
import com.tracker.incidentTracker.Enum.Status;
import com.tracker.incidentTracker.Repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import java.util.List;

import java.util.UUID;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    public Page<IncidentResponseDTO> getIncidents(String search,String service, Status status, List<Severity> severity, Pageable pageable){

        Specification<Incident> spec = IncidentSpecification.withFilters(search, service,status, severity);
        return incidentRepository.findAll(spec, pageable).map(this::mapEntityToResponseDTO);
    }
    @Transactional
    public IncidentResponseDTO createIncident(IncidentRequestDTO request){

        Incident incident = mapRequestDTOtoEntity(request);

        Incident responseIncident = incidentRepository.save(incident);

        return mapEntityToResponseDTO(responseIncident);
    }

    public IncidentResponseDTO getIncidentById(UUID id)
    {
        Incident incident = incidentRepository.findById(id).orElseThrow(()->new RuntimeException("Incident not found"));
        return mapEntityToResponseDTO(incident);
    }
    @Transactional
    public IncidentResponseDTO updateStatus(UUID id, Status status )
    {
        Incident incident = incidentRepository.findById(id).orElseThrow(()->new RuntimeException("Incident not found"));
        incident.setStatus(status);
        return mapEntityToResponseDTO(incident);
    }


    @Transactional
    public IncidentResponseDTO updateIncident(UUID id, IncidentRequestDTO requestDTO)
    {
        Incident incd = incidentRepository.findById(id).orElseThrow(()-> new RuntimeException("Incident not found"));
        incd.setTitle(requestDTO.getTitle());
        incd.setSummary(requestDTO.getSummary());
        incd.setOwner(requestDTO.getOwner());
        incd.setSeverity(requestDTO.getSeverity());

        return mapEntityToResponseDTO(incidentRepository.save(incd));
    }


    private Incident mapRequestDTOtoEntity(IncidentRequestDTO request)
    {
        Incident inc = Incident.builder().
                title(request.getTitle()).
                service(request.getService()).
                severity(request.getSeverity()).
                status(Status.OPEN).
                owner(request.getOwner()).
                summary(request.getSummary()).
                build();

        return inc;
    }

    private IncidentResponseDTO mapEntityToResponseDTO(Incident incident)
    {
        IncidentResponseDTO resp = IncidentResponseDTO.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .service(incident.getService())
                .severity(incident.getSeverity())
                .status(incident.getStatus())
                .owner(incident.getOwner())
                .summary(incident.getSummary())
                .createdAt(incident.getCreatedAt())
                .build();
        return resp;
    }

}
