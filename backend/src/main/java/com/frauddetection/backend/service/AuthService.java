package com.frauddetection.backend.service;

import com.frauddetection.backend.model.User;
import com.frauddetection.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

//    public User register(String name, String email, String phone, String rawPassword) {
//        boolean exists = userRepository.findAll().stream()
//                .anyMatch(u ->.getEmail().equalsIgnoreCase(email));
//
//        if(exists){
//            throw new RuntimeException("Email already registered. Please login instead.");
//        }
//
//        User user = new User();
//        user.setName(name);
//        user.setEmail(email);
//        user.setPhone(phone);
//        user.setPasswordHash(passwordEncoder.encode(rawPassword));
//        user.setRole("USER");
//        return userRepository.save(user);
//    }
public User register(String name, String email, String phone, String rawPassword) {
    boolean exists = userRepository.findAll().stream()
            .anyMatch(u -> u.getEmail().equalsIgnoreCase(email));

    if (exists) {
        throw new RuntimeException("Email already registered. Please login instead.");
    }

    User user = new User();
    user.setName(name);
    user.setEmail(email);
    user.setPhone(phone);
    user.setPasswordHash(passwordEncoder.encode(rawPassword));
    user.setRole("USER");
    return userRepository.save(user);
}

    public User login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}