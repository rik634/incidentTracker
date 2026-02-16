package com.tracker.incidentTracker.Config;


import com.tracker.incidentTracker.Enum.Severity;
import com.tracker.incidentTracker.Enum.Status;
import com.tracker.incidentTracker.Repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.tracker.incidentTracker.Entity.Incident;
import java.util.Random;

@Configuration
public class DataSeeder implements CommandLineRunner{

    @Autowired
    private IncidentRepository repository;

    @Override
    public void run(String... args) throws Exception {

        if (repository.count() == 0) {
            Random random = new Random();
            String[] services = {"Auth","Payments","Backend","Frontend","Database"};
            Severity[] severities = Severity.values();
            Status[] statuses = Status.values();

            for (int i = 1; i <= 200; i++) {
                Incident incident = Incident.builder()
                        .title("Issue #" + i + ": " + services[random.nextInt(services.length)] + " failure")
                        .service(services[random.nextInt(services.length)])
                        .severity(severities[random.nextInt(severities.length)])
                        .status(statuses[random.nextInt(statuses.length)])
                        // Updated to pass the @Email validation check
                        .owner("engineer" + i + "@team.com")
                        .summary("Automated log: Detectable latency spike observed in " + i + " occurrences.")
                        .build();

                repository.save(incident);
            }
            System.out.println("Successfully seeded 200 incident records.");
        }
    }
}
