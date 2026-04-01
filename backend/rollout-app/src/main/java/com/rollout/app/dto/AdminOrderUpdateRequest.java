package com.rollout.app.dto;

import lombok.Data;

import java.util.List;

@Data
public class AdminOrderUpdateRequest {
    private String status;
    private List<AdminOrderLineUpdateRequest> items;
}
