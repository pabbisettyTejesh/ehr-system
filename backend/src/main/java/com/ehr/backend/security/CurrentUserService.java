package com.ehr.backend.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserService {

    public CustomUserPrincipal getPrincipal() {
        return (CustomUserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
    }

    public Long getUserId() {
        return getPrincipal().getUserId();
    }

    public String getRole() {
        return getPrincipal().getRole();
    }

    public String getEmail() {
        return getPrincipal().getEmail();
    }
}
