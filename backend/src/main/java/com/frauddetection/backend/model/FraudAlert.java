package com.frauddetection.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "fraud_alerts")
@Data
public class FraudAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long transactionId;
    private String reason;
    private String reviewedBy;
    private String reviewStatus;
}
