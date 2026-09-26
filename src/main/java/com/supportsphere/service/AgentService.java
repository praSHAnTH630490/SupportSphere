package com.supportsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.supportsphere.dto.CreateAgentRequest;
import com.supportsphere.entity.Agent;
import com.supportsphere.entity.Role;
import com.supportsphere.entity.User;
import com.supportsphere.repository.AgentRepository;
import com.supportsphere.repository.RoleRepository;
import com.supportsphere.repository.UserRepository;

@Service
public class AgentService {

    private final AgentRepository agentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AgentService(
            AgentRepository agentRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.agentRepository = agentRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Agent saveAgent(Agent agent) {

        return agentRepository.save(agent);
    }

    @Transactional
    public Agent createAgent(CreateAgentRequest request) {

        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        Role agentRole = roleRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("AGENT role not found"));

        LocalDateTime now = LocalDateTime.now();

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole(agentRole);
        user.setPhone(request.getPhone());
        user.setIsActive(true);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        User savedUser = userRepository.save(user);

        Agent agent = new Agent();

        agent.setUser(savedUser);
        agent.setEmployeeCode(request.getEmployeeCode());
        agent.setDepartment(request.getDepartment());

        if (request.getAvailabilityStatus() == null
                || request.getAvailabilityStatus().isBlank()) {

            agent.setAvailabilityStatus("AVAILABLE");

        } else {

            agent.setAvailabilityStatus(
                    request.getAvailabilityStatus()
            );
        }

        agent.setCreatedAt(now);

        return agentRepository.save(agent);
    }

    public List<Agent> getAllAgents() {

        return agentRepository.findAll();
    }

    public Agent getAgentById(Long agentId) {

        return agentRepository.findById(agentId).orElse(null);
    }

    public Agent getAgentByUserId(Long userId) {

        return agentRepository.findByUserUserId(userId);
    }

    public void deleteAgent(Long agentId) {

        agentRepository.deleteById(agentId);
    }

    public Agent updateAgentStatus(Long agentId, String status) {

        Agent agent = agentRepository.findById(agentId).orElse(null);

        if (agent == null) {

            throw new RuntimeException("Agent not found");
        }

        agent.setAvailabilityStatus(status);

        return agentRepository.save(agent);
    }
}
