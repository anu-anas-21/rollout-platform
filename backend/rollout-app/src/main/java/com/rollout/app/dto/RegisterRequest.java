package com.rollout.app.dto;

import com.rollout.app.entity.UserRole;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private UserRole role;
}
