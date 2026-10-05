package com.frauddetection.backend.model;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
public class TransactionRequest {
    private Long userId;
    private BigDecimal amount;
    private String location;
    private Map<String, Object> mlFeatures;
}
