package com.rollout.app.dto;

import lombok.Data;

@Data
public class AdminOrderLineUpdateRequest {
    private Long itemId;
    private Integer quantity;
}
