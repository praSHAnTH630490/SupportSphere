package com.supportsphere.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.supportsphere.dto.CreateAgentRequest;
import com.supportsphere.entity.Agent;
import com.supportsphere.service.AgentService;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {

        this.agentService = agentService;
    }

    @PostMapping
    public Agent createAgent(@RequestBody Agent agent) {

        return agentService.saveAgent(agent);
    }

    @PostMapping("/create")
    public Agent createAgentAccount(
            @RequestBody CreateAgentRequest request) {

        return agentService.createAgent(request);
    }

    @GetMapping
    public List<Agent> getAllAgents() {

        return agentService.getAllAgents();
    }

    @GetMapping("/{agentId}")
    public Agent getAgentById(@PathVariable Long agentId) {

        return agentService.getAgentById(agentId);
    }

    @GetMapping("/user/{userId}")
    public Agent getAgentByUserId(@PathVariable Long userId) {

        return agentService.getAgentByUserId(userId);
    }

    @PutMapping("/{agentId}/status")
    public Agent updateAgentStatus(
            @PathVariable Long agentId,
            @RequestParam String status) {

        return agentService.updateAgentStatus(agentId, status);
    }

    @DeleteMapping("/{agentId}")
    public void deleteAgent(@PathVariable Long agentId) {

        agentService.deleteAgent(agentId);
    }
}
