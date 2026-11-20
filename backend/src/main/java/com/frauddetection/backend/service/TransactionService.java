package com.frauddetection.backend.service;

import com.frauddetection.backend.model.Transaction;
import com.frauddetection.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private MLClientService mlClientService;

    public Transaction processTransaction(Transaction transaction, Map<String, Object> features) {
        Double fraudProb = 0.05;
        Boolean isFraud = false;

        try {
            Map<String, Object> result = mlClientService.getFraudPrediction(features);
            if (result != null && result.get("fraud_probability") != null) {
                fraudProb = ((Number) result.get("fraud_probability")).doubleValue();
                isFraud = (result.get("is_fraud") != null && Boolean.TRUE.equals(result.get("is_fraud")));
            }
        } catch (Exception e) {
            System.err.println("ML Service call error (using fallback): " + e.getMessage());
            // Fallback heuristics if ML service is cold-starting or connecting
            if (transaction.getAmount() != null && transaction.getAmount().doubleValue() > 50000) {
                fraudProb = 0.85;
                isFraud = true;
            }
        }

        transaction.setFraudScore(fraudProb);
        transaction.setStatus(isFraud ? "Flagged" : "Approved");
        transaction.setTimestamp(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
