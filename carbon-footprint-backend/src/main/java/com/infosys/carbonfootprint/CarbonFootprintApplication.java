package com.infosys.carbonfootprint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main Entry Point for Carbon Footprint Monitoring System Backend.
 * Infosys Internship Milestone 1 Project.
 *
 * @author Infosys Intern
 * @version 1.0
 */
@SpringBootApplication
@EnableAsync
public class CarbonFootprintApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarbonFootprintApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Carbon Footprint Backend Started Successfully! ");
        System.out.println("=================================================");
    }
}
