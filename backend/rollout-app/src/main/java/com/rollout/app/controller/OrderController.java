package com.rollout.app.controller;

import com.rollout.app.dto.AdminOrderUpdateRequest;
import com.rollout.app.dto.PlaceOrderRequest;
import com.rollout.app.entity.ShopOrder;
import com.rollout.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public List<ShopOrder> listAll() {
        return orderService.findAllForAdmin();
    }

    @PatchMapping("/{id}")
    public ShopOrder updateOrder(@PathVariable Long id, @RequestBody AdminOrderUpdateRequest request) {
        return orderService.updateForAdmin(id, request);
    }
}
