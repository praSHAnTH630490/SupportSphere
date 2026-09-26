package com.supportsphere.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.supportsphere.entity.Customer;
import com.supportsphere.entity.User;
import com.supportsphere.repository.CustomerRepository;
import com.supportsphere.repository.UserRepository;
import com.supportsphere.security.SecurityUtil;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            UserRepository userRepository) {

        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public Customer saveCustomer(Customer customer) {

        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {

        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long customerId) {

        return customerRepository.findById(customerId).orElse(null);
    }

    public void deleteCustomer(Long customerId) {

        customerRepository.deleteById(customerId);
    }

    public Customer getMyProfile() {

    String email = SecurityUtil.getLoggedInEmail();

    User user = userRepository.findByEmail(email);

    if (user == null) {
        return null;
    }

    return customerRepository.findByUserId(user.getUserId());
}

    public Customer updateMyProfile(Customer updatedCustomer) {

    String email = SecurityUtil.getLoggedInEmail();

    User user = userRepository.findByEmail(email);

    if (user == null) {
        return null;
    }

    // Update User information
    if (updatedCustomer.getUser() != null) {

        if (updatedCustomer.getUser().getName() != null) {
            user.setName(updatedCustomer.getUser().getName());
        }

        if (updatedCustomer.getUser().getEmail() != null) {
            user.setEmail(updatedCustomer.getUser().getEmail());
        }

        if (updatedCustomer.getUser().getPhone() != null) {
            user.setPhone(updatedCustomer.getUser().getPhone());
        }

        userRepository.save(user);
    }

    // Find the logged-in customer's record
    Customer existingCustomer =
            customerRepository.findByUserId(user.getUserId());

    if (existingCustomer == null) {
        return null;
    }

    // Update Customer information
    existingCustomer.setCompanyName(
            updatedCustomer.getCompanyName()
    );

    existingCustomer.setAddress(
            updatedCustomer.getAddress()
    );

    return customerRepository.save(existingCustomer);
}
}
