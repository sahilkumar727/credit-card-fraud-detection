package com.frauddetection.backend.repository;

import com.frauddetection.backend.model.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FraudAlertRepository extends JpaRepository<FraudAlert,Long> {
}
