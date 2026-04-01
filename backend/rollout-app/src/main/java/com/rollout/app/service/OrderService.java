package com.rollout.app.service;

import com.rollout.app.dto.OrderLineRequest;
import com.rollout.app.dto.PlaceOrderRequest;
import com.rollout.app.dto.AdminOrderLineUpdateRequest;
import com.rollout.app.dto.AdminOrderUpdateRequest;
import com.rollout.app.entity.OrderItem;
import com.rollout.app.entity.OrderStatus;
import com.rollout.app.entity.Product;
import com.rollout.app.entity.ShopOrder;
import com.rollout.app.repository.ProductRepository;
import com.rollout.app.repository.ShopOrderRepository;
import com.rollout.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final ShopOrderRepository shopOrderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public ShopOrder placeOrder(PlaceOrderRequest request) {
        if (request.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order must contain at least one item");
        }
        if (!userRepository.existsById(request.getUserId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> lineItems = new ArrayList<>();

        for (OrderLineRequest line : request.getItems()) {
            if (line.getProductId() == null || line.getQuantity() == null || line.getQuantity() < 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Each line needs productId and quantity >= 1");
            }
            Product product = productRepository.findById(line.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + line.getProductId()));
            if (product.getStock() == null || product.getStock() < line.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for: " + product.getName());
            }
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(line.getQuantity()));
            total = total.add(lineTotal);

            OrderItem item = OrderItem.builder()
                    .productId(product.getId())
                    .quantity(line.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            lineItems.add(item);

            product.setStock(product.getStock() - line.getQuantity());
            productRepository.save(product);
        }

        ShopOrder order = ShopOrder.builder()
                .userId(request.getUserId())
                .total(total)
                .status(OrderStatus.CONFIRMED)
                .build();

        for (OrderItem item : lineItems) {
            item.setOrder(order);
            order.getItems().add(item);
        }

        return shopOrderRepository.save(order);
    }

    public List<ShopOrder> findAllForAdmin() {
        return shopOrderRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public ShopOrder updateForAdmin(Long orderId, AdminOrderUpdateRequest request) {
        ShopOrder order = shopOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                order.setStatus(OrderStatus.valueOf(request.getStatus().trim().toUpperCase()));
            } catch (IllegalArgumentException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status");
            }
        }

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            Map<Long, OrderItem> orderItemsById = new HashMap<>();
            for (OrderItem item : order.getItems()) {
                orderItemsById.put(item.getId(), item);
            }
            for (AdminOrderLineUpdateRequest line : request.getItems()) {
                if (line.getItemId() == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "itemId is required for each line");
                }
                OrderItem item = orderItemsById.get(line.getItemId());
                if (item == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order item not found: " + line.getItemId());
                }
                if (line.getQuantity() == null || line.getQuantity() < 1) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be >= 1");
                }
                item.setQuantity(line.getQuantity());
            }
        }

        BigDecimal recalculatedTotal = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            recalculatedTotal = recalculatedTotal.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setTotal(recalculatedTotal);
        return shopOrderRepository.save(order);
    }
}
