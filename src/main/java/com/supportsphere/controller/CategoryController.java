package com.supportsphere.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import com.supportsphere.entity.Category;
import com.supportsphere.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PutMapping("/{categoryId}")
public Category updateCategory(
        @PathVariable Integer categoryId,
        @RequestBody Category category) {

    return categoryService.updateCategory(categoryId, category);
}

    @GetMapping("/{categoryId}")
public Category getCategoryById(@PathVariable Integer categoryId) {

    return categoryService.getCategoryById(categoryId);
}

    @DeleteMapping("/{categoryId}")
public void deleteCategory(@PathVariable Integer categoryId) {
    categoryService.deleteCategory(categoryId);
}
}
