package com.rollout.app.service;

import com.rollout.app.entity.GalleryImage;
import com.rollout.app.repository.GalleryImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryImageRepository galleryImageRepository;
    private final FileStorageService fileStorageService;

    public List<GalleryImage> findAll() {
        return galleryImageRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<GalleryImage> createMany(List<MultipartFile> images) {
        List<GalleryImage> saved = new ArrayList<>();
        for (MultipartFile image : images) {
            if (image == null || image.isEmpty()) {
                continue;
            }
            String imageUrl = fileStorageService.saveImage(image, "gallery");
            GalleryImage item = GalleryImage.builder()
                    .imageUrl(imageUrl)
                    .caption("")
                    .createdAt(LocalDateTime.now())
                    .build();
            saved.add(galleryImageRepository.save(item));
        }
        if (saved.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one non-empty image is required");
        }
        return saved;
    }

    public void delete(Long id) {
        GalleryImage item = galleryImageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gallery image not found"));
        fileStorageService.deleteByUrl(item.getImageUrl());
        galleryImageRepository.delete(item);
    }
}

