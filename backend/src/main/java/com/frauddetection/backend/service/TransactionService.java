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
        Map<String, Object> result = mlClientService.getFraudPrediction(features);

        Double fraudProb = (result != null && result.get("fraud_probability") != null)
                ? ((Number) result.get("fraud_probability")).doubleValue()
                : 0.0;
        Boolean isFraud = (result != null && Boolean.TRUE.equals(result.get("is_fraud")));

        transaction.setFraudScore(fraudProb);
        transaction.setStatus(isFraud ? "Flagged" : "Approved");
        transaction.setTimestamp(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
