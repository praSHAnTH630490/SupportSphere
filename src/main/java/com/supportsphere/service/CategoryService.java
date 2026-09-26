package com.supportsphere.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.Category;
import com.supportsphere.repository.CategoryRepository;
import com.supportsphere.entity.User;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.SecurityUtil;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(
        CategoryRepository categoryRepository,
        UserRepository userRepository) {

    this.categoryRepository = categoryRepository;
    this.userRepository = userRepository;
}
    public User getLoggedInUser() {

    String email = SecurityUtil.getLoggedInEmail();

    if (email == null) {
        return null;
    }

    return userRepository.findByEmail(email);
}

    public Category saveCategory(Category category) {
    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // Only ADMIN can create categories
    if (!"ADMIN".equals(role)) {
        return null;
    }

    category.setCreatedAt(LocalDateTime.now());

    return categoryRepository.save(category);
}

    public List<Category> getAllCategories() {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return List.of();
    }

    String role = loggedInUser.getRole().getRoleName();

    // ADMIN, AGENT and CUSTOMER can view categories
    if ("ADMIN".equals(role)
            || "AGENT".equals(role)
            || "CUSTOMER".equals(role)) {

        return categoryRepository.findAll();
    }

    return List.of();
}

    public Category getCategoryById(Integer categoryId) {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // ADMIN, AGENT and CUSTOMER can view a category
    if ("ADMIN".equals(role)
            || "AGENT".equals(role)
            || "CUSTOMER".equals(role)) {

        return categoryRepository
                .findById(categoryId)
                .orElse(null);
    }

    return null;
}

    public void deleteCategory(Integer categoryId) {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return;
    }

    String role = loggedInUser.getRole().getRoleName();

    // Only ADMIN can delete categories
    if (!"ADMIN".equals(role)) {
        return;
    }

    if (!categoryRepository.existsById(categoryId)) {
        return;
    }

    categoryRepository.deleteById(categoryId);
}
    public Category updateCategory(
        Integer categoryId,
        Category category)  {

    User loggedInUser = getLoggedInUser();

    if (loggedInUser == null) {
        return null;
    }

    String role = loggedInUser.getRole().getRoleName();

    // Only ADMIN can update categories
    if (!"ADMIN".equals(role)) {
        return null;
    }

    Category existingCategory =
            categoryRepository.findById(categoryId)
                    .orElse(null);

    if (existingCategory == null) {
        return null;
    }

    existingCategory.setName(category.getName());
    existingCategory.setDescription(category.getDescription());

    return categoryRepository.save(existingCategory);
}
}
