package com.rollout.app.dto;

import com.rollout.app.entity.ProductCategory;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private ProductCategory category;
}
