package com.rollout.app.repository;

import com.rollout.app.entity.Product;
import com.rollout.app.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(ProductCategory category);
}
