package com.rollout.app.service;

import com.rollout.app.entity.GalleryImage;
import com.rollout.app.repository.GalleryImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryImageRepository galleryImageRepository;
    private final FileStorageService fileStorageService;

    public List<GalleryImage> findAll() {
        return galleryImageRepository.findAllByOrderByCreatedAtDesc();
    }

    public GalleryImage create(MultipartFile image, String caption) {
        String imageUrl = fileStorageService.saveImage(image, "gallery");
        GalleryImage item = GalleryImage.builder()
                .imageUrl(imageUrl)
                .caption(caption == null ? "" : caption.trim())
                .createdAt(LocalDateTime.now())
                .build();
        return galleryImageRepository.save(item);
    }

    public void delete(Long id) {
        GalleryImage item = galleryImageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gallery image not found"));
        fileStorageService.deleteByUrl(item.getImageUrl());
        galleryImageRepository.delete(item);
    }
}

