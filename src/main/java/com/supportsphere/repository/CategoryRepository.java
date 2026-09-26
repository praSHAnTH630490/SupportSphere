package com.supportsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.supportsphere.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
