package com.tracker.incidentTracker.Controller;

import com.tracker.incidentTracker.DTO.IncidentRequestDTO;
import com.tracker.incidentTracker.DTO.IncidentResponseDTO;
import com.tracker.incidentTracker.Enum.Severity;
import com.tracker.incidentTracker.Enum.Status;
import com.tracker.incidentTracker.Service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
     private IncidentService incidentService;


    @GetMapping
    public ResponseEntity<Page<IncidentResponseDTO>> getIncidents
            (@RequestParam(required = false) String search,
             @RequestParam(required = false) String service,
             @RequestParam(required = false) List<Severity> severity,
             @RequestParam(required = false) Status status,
             @PageableDefault(size = 10, sort = "createdAt") Pageable pageable){

        return ResponseEntity.ok(incidentService.getIncidents(search,service,status,severity,pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponseDTO> getIncidentById(@PathVariable UUID id){

        IncidentResponseDTO resp = incidentService.getIncidentById(id);
        return ResponseEntity.ok(resp);
    }
    @PostMapping
    public ResponseEntity<IncidentResponseDTO> create(@Valid @RequestBody  IncidentRequestDTO requestDTO)
    {
        IncidentResponseDTO responseDTO = incidentService.createIncident(requestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentResponseDTO> updateStatus(@PathVariable UUID id, @RequestParam Status status){
        return ResponseEntity.ok(incidentService.updateStatus(id,status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentResponseDTO> updateIncident(@PathVariable UUID id, @RequestBody IncidentRequestDTO request)
    {
        return ResponseEntity.ok(incidentService.updateIncident(id,request));
    }


}
