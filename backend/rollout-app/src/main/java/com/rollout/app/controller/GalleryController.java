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
    public GalleryImage create(
            @RequestParam MultipartFile image,
            @RequestParam(required = false) String caption
    ) {
        return galleryService.create(image, caption);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        galleryService.delete(id);
    }
}

