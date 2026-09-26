package com.supportsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.supportsphere.entity.Agent;

public interface AgentRepository extends JpaRepository<Agent, Long> {

    Agent findByUserUserId(Long userId);

}
