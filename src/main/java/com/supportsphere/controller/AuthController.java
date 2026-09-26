package com.supportsphere.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.supportsphere.dto.LoginRequest;
import com.supportsphere.dto.LoginResponse;
import com.supportsphere.dto.RegisterRequest;
import com.supportsphere.entity.Customer;
import com.supportsphere.entity.Role;
import com.supportsphere.entity.User;
import com.supportsphere.repository.CustomerRepository;
import com.supportsphere.repository.RoleRepository;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.JwtService;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final CustomerRepository customerRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            RoleRepository roleRepository,
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        User user =
                userRepository.findByEmail(
                        request.getEmail());

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        if (!user.getIsActive()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User account is inactive");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole().getRoleName());

        LoginResponse response =
                new LoginResponse(
                        user.getUserId(),
                        token,
                        user.getEmail(),
                        user.getRole().getRoleName());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
           @Valid @RequestBody RegisterRequest request) {

        // Check whether email already exists
        User existingUser =
                userRepository.findByEmail(
                        request.getEmail());

        if (existingUser != null) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email already registered");
        }

        // Get CUSTOMER role
        Role customerRole =
                roleRepository.findById(3)
                        .orElse(null);

        if (customerRole == null) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Customer role not found");
        }

        // Create new user
        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPhone(request.getPhone());

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()));

        // Always assign CUSTOMER role
        user.setRole(customerRole);

        user.setIsActive(true);

        LocalDateTime now =
                LocalDateTime.now();

        user.setCreatedAt(now);

        user.setUpdatedAt(now);

        // Save User first
        User savedUser =
                userRepository.save(user);

        // Create corresponding Customer record
        Customer customer =
                new Customer();

        customer.setUser(savedUser);

        customer.setCreatedAt(now);

        // Company name and address are optional
        customer.setCompanyName(null);

        customer.setAddress(null);

        customerRepository.save(customer);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedUser);
    }
}
