package com.frauddetection.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MLClientService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ml.service.url:http://localhost:8000/predict}")
    private String mlUrl;

    public Map<String, Object> getFraudPrediction(Map<String, Object> features) {
        return restTemplate.postForObject(mlUrl, features, Map.class);
    }
}
