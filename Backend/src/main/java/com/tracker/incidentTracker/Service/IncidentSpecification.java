package com.tracker.incidentTracker.Service;

import com.tracker.incidentTracker.Entity.Incident;
import org.springframework.data.jpa.domain.Specification;
import com.tracker.incidentTracker.Enum.Status;
import com.tracker.incidentTracker.Enum.Severity;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;


public class IncidentSpecification {

    public static Specification<Incident> withFilters(String search,String service, Status status, List<Severity> severity){

        return (root,query,cb)->{
          List<Predicate> predicates = new ArrayList<>();

            // 1. Text Search (Matches Title)
            if (search != null && !search.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
            }

            // 2. Service Filter (Exact Match from Dropdown)
            if (service != null && !service.isEmpty()) {
                predicates.add(cb.equal(root.get("service"), service));
            }

            // 3. Status Filter (Exact Match from Dropdown)
            if (status != null ) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            // 4. Severity Filter (Checkbox/Enum)
            if (severity != null && !severity.isEmpty()) {
                predicates.add(root.get("severity").in(severity));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
