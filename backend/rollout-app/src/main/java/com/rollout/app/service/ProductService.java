package com.rollout.app.service;

import com.rollout.app.dto.ProductRequest;
import com.rollout.app.entity.Product;
import com.rollout.app.entity.ProductCategory;
import com.rollout.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public List<Product> findByCategory(ProductCategory category) {
        return productRepository.findByCategory(category);
    }

    public Product create(ProductRequest request) {
        validate(request);
        Product product = Product.builder()
                .name(request.getName().trim())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .price(request.getPrice())
                .category(request.getCategory())
                .build();
        return productRepository.save(product);
    }

    public Product createFromForm(String name, String description, String priceRaw, String categoryRaw, MultipartFile image) {
        ProductRequest request = toRequest(name, description, priceRaw, categoryRaw);
        Product product = create(request);
        if (image != null && !image.isEmpty()) {
            product.setImageUrl(fileStorageService.saveImage(image, "products"));
            product = productRepository.save(product);
        }
        return product;
    }

    public Product updateFromForm(Long id, String name, String description, String priceRaw, String categoryRaw, MultipartFile image) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        ProductRequest request = toRequest(name, description, priceRaw, categoryRaw);
        validate(request);

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription() != null ? request.getDescription() : "");
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());

        if (image != null && !image.isEmpty()) {
            fileStorageService.deleteByUrl(product.getImageUrl());
            product.setImageUrl(fileStorageService.saveImage(image, "products"));
        }
        return productRepository.save(product);
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        fileStorageService.deleteByUrl(product.getImageUrl());
        productRepository.delete(product);
    }

    private void validate(ProductRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }
        if (request.getPrice() == null || request.getPrice().signum() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid price is required");
        }
        if (request.getCategory() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required");
        }
    }

    private ProductRequest toRequest(String name, String description, String priceRaw, String categoryRaw) {
        ProductRequest req = new ProductRequest();
        req.setName(name);
        req.setDescription(description);
        try {
            req.setPrice(priceRaw == null ? null : new java.math.BigDecimal(priceRaw));
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price must be a valid number");
        }
        try {
            req.setCategory(categoryRaw == null ? null : ProductCategory.valueOf(categoryRaw));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is invalid");
        }
        return req;
    }
}
