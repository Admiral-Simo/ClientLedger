package com.clientledger.backend.aws;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sesv2.SesV2Client;

@Configuration
public class AwsConfig {

    @Bean
    public SesV2Client sesV2Client() {
        return SesV2Client.builder()
                .region(Region.EU_WEST_3)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }
}