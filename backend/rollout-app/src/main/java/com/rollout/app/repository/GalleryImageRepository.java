package com.rollout.app.repository;

import com.rollout.app.entity.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, Long> {

    List<GalleryImage> findAllByOrderByCreatedAtDesc();
}

