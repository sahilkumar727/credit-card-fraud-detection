package com.frauddetection.backend.model;

import lombok.Data;

@Data
public class AuthRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
}