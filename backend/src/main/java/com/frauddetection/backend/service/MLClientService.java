package com.frauddetection.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MLClientService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String ML_URL = "http://localhost:8000/predict";

    public Map<String, Object> getFraudPrediction(Map<String, Object> features) {
        return restTemplate.postForObject(ML_URL, features, Map.class);
    }
}