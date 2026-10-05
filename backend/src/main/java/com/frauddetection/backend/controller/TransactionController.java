package com.frauddetection.backend.controller;

import com.frauddetection.backend.model.Transaction;
import com.frauddetection.backend.model.TransactionRequest;
import com.frauddetection.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://local:3000")
@RestController
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/transaction")
    public Transaction createTransaction(@RequestBody TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(request.getUserId());
        transaction.setAmount(request.getAmount());
        transaction.setLocation(request.getLocation());

        return transactionService.processTransaction(transaction, request.getMlFeatures());
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }
}