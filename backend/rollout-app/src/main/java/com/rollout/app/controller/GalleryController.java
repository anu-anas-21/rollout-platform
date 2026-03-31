package com.rollout.app.controller;

import com.rollout.app.entity.GalleryImage;
import com.rollout.app.service.GalleryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping
    public List<GalleryImage> listAll() {
        return galleryService.findAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public List<GalleryImage> create(
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "image", required = false) MultipartFile single
    ) {
        // Support both single "image" and multiple "images" fields.
        List<MultipartFile> all = new java.util.ArrayList<>();
        if (images != null) {
            all.addAll(images);
        }
        if (single != null) {
            all.add(single);
        }
        return galleryService.createMany(all);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        galleryService.delete(id);
    }
}

