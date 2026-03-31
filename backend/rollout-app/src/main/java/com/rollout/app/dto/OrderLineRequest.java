package com.rollout.app.dto;

import lombok.Data;

@Data
public class OrderLineRequest {
    private Long productId;
    private Integer quantity;
}
