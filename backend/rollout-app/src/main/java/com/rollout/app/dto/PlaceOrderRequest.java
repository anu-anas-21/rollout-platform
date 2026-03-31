package com.rollout.app.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlaceOrderRequest {
    private Long userId;
    private List<OrderLineRequest> items;
}
