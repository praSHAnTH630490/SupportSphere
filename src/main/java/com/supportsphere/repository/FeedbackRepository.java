package com.supportsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.supportsphere.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}
