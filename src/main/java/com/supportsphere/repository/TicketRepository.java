package com.supportsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.supportsphere.entity.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCustomerCustomerId(Long customerId);

    List<Ticket> findByAssignedAgentAgentId(Long agentId);
}
