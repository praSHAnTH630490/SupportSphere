package com.supportsphere.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Security headers
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(contentType -> {})
            )

            .formLogin(form -> form.disable())

            .httpBasic(basic -> basic.disable())

            .logout(logout -> logout.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Authentication
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register"
                ).permitAll()

                // Admin-only APIs
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")

                // Agent-only APIs
                .requestMatchers("/api/agent/**")
                .hasRole("AGENT")

                // Customer-only APIs
                .requestMatchers("/api/customer/**")
                .hasRole("CUSTOMER")

                // User management
                .requestMatchers("/api/users/**")
                .hasAnyRole("ADMIN", "AGENT")

                // Customer profile - logged-in customer only
                .requestMatchers("/api/customers/profile")
                .hasRole("CUSTOMER")

                // Customer management
                .requestMatchers("/api/customers/**")
                .hasAnyRole("ADMIN", "AGENT")

                // Agent profile lookup
                .requestMatchers("/api/agents/user/**")
                .hasAnyRole("ADMIN", "AGENT")

                // Agent management
                .requestMatchers("/api/agents/**")
                .hasRole("ADMIN")

                // Categories
                .requestMatchers("/api/categories/**")
                .hasAnyRole("ADMIN", "AGENT", "CUSTOMER")

                // Tickets
                .requestMatchers("/api/tickets/**")
                .hasAnyRole("ADMIN", "AGENT", "CUSTOMER")

                // Messages
                .requestMatchers("/api/messages/**")
                .hasAnyRole("ADMIN", "AGENT", "CUSTOMER")

                // AI Conversations and Messages
                .requestMatchers("/api/ai/**")
                .hasAnyRole("ADMIN", "AGENT", "CUSTOMER")

                // Knowledge Base - read/search access
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/knowledge/search/**"
                )
                .hasAnyRole("ADMIN", "AGENT", "CUSTOMER")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/knowledge/documents/**"
                )
                .hasAnyRole("ADMIN", "AGENT")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/knowledge/chunks/**"
                )
                .hasAnyRole("ADMIN", "AGENT")

                // Knowledge Base - admin management
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/knowledge/documents/**"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/knowledge/documents/**"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PATCH,
                    "/api/knowledge/documents/**"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/knowledge/documents/**"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/knowledge/processing/**"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/knowledge/chunks/**"
                )
                .hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/knowledge/chunks/**"
                )
                .hasRole("ADMIN")

                // Notifications
                .requestMatchers("/api/notifications/**")
                .hasAnyRole("ADMIN", "AGENT", "CUSTOMER")

                // Feedback
                .requestMatchers("/api/feedback/**")
                .hasAnyRole("ADMIN", "AGENT", "CUSTOMER")

                // Everything else requires authentication
                .anyRequest()
                .authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
            new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}
