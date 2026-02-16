package com.tracker.incidentTracker.Config;


import com.tracker.incidentTracker.Enum.Severity;
import com.tracker.incidentTracker.Enum.Status;
import com.tracker.incidentTracker.Repository.IncidentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.tracker.incidentTracker.Entity.Incident;
import java.util.Random;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(IncidentRepository repository)
    {
        return args -> {
            if(repository.count()==0)
            {
                Random random = new Random();
                String [] services ={"Auth-Service","Payment-Gateway", "Inventory-DB","UI-Gateway", "Mail-Server"};

                for(int i=1;i<=200;i++)
                {
                    Incident incident = Incident.builder()
                            .title("Issues with"+services[i%5]+"#"+i)
                            .service(services[i%5])
                            .severity(Severity.values()[random.nextInt(Severity.values().length)])
                            .status(Status.values()[random.nextInt(Status.values().length)])
                            .owner("Engineer_"+(i%10))
                            .summary("Auto-generated logs for the simulation of the incident number"+i)
                            .build();
                    repository.save(incident);

                }
                System.out.println("Successfully seeded 200 incidents!");
            }
        };
    }
}
