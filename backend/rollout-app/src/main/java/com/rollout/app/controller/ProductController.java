package com.rollout.app.controller;

import com.rollout.app.dto.ProductRequest;
import com.rollout.app.entity.Product;
import com.rollout.app.entity.ProductCategory;
import com.rollout.app.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> listAll() {
        return productService.findAll();
    }

    @GetMapping("/category/{category}")
    public List<Product> byCategory(@PathVariable ProductCategory category) {
        return productService.findByCategory(category);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PostMapping(value = "/form", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public Product createWithImage(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam String price,
            @RequestParam String category,
            @RequestParam(required = false) MultipartFile image
    ) {
        return productService.createFromForm(name, description, price, category, image);
    }

    @PutMapping(value = "/{id}/form", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product updateWithImagePut(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam String price,
            @RequestParam String category,
            @RequestParam(required = false) MultipartFile image
    ) {
        return productService.updateFromForm(id, name, description, price, category, image);
    }

    // Accept POST as well to avoid 405 issues from some clients when sending multipart.
    @PostMapping(value = "/{id}/form", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product updateWithImagePost(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam String price,
            @RequestParam String category,
            @RequestParam(required = false) MultipartFile image
    ) {
        return productService.updateFromForm(id, name, description, price, category, image);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}
