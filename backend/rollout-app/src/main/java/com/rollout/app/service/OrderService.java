package com.rollout.app.service;

import com.rollout.app.dto.OrderLineRequest;
import com.rollout.app.dto.PlaceOrderRequest;
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
import java.util.List;

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
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(line.getQuantity()));
            total = total.add(lineTotal);

            OrderItem item = OrderItem.builder()
                    .productId(product.getId())
                    .quantity(line.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            lineItems.add(item);
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
}
