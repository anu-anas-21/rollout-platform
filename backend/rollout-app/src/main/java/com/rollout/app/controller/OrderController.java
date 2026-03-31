package com.rollout.app.controller;

import com.rollout.app.dto.PlaceOrderRequest;
import com.rollout.app.entity.ShopOrder;
import com.rollout.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ShopOrder placeOrder(@RequestBody PlaceOrderRequest request) {
        return orderService.placeOrder(request);
    }
}
