package com.rollout.app.repository;

import com.rollout.app.entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopOrderRepository extends JpaRepository<ShopOrder, Long> {

    List<ShopOrder> findByUserIdOrderByIdDesc(Long userId);
}
