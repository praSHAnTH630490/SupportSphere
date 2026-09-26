package com.supportsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.User;
import com.supportsphere.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User updateUser(Long userId, User updatedUser) {

    User existingUser = userRepository.findById(userId).orElse(null);

    if (existingUser == null) {
        return null;
    }

    existingUser.setName(updatedUser.getName());
    existingUser.setEmail(updatedUser.getEmail());
    existingUser.setPhone(updatedUser.getPhone());

    return userRepository.save(existingUser);
}

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
