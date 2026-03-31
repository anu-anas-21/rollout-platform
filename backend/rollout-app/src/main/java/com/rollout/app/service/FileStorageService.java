package com.rollout.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String saveImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image uploads are supported");
        }
        String extension = getExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + (extension.isBlank() ? "" : "." + extension);

        try {
            Path targetDir = uploadRoot.resolve(folder).normalize();
            Files.createDirectories(targetDir);
            Path targetFile = targetDir.resolve(fileName).normalize();
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + folder + "/" + fileName;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save image");
        }
    }

    public void deleteByUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank() || !imageUrl.startsWith("/uploads/")) return;
        try {
            String relative = imageUrl.substring("/uploads/".length());
            Path target = uploadRoot.resolve(relative).normalize();
            if (target.startsWith(uploadRoot)) {
                Files.deleteIfExists(target);
            }
        } catch (IOException ignored) {
            // Ignore cleanup failure to avoid blocking delete flows.
        }
    }

    private String getExtension(String fileName) {
        if (fileName == null) return "";
        int idx = fileName.lastIndexOf('.');
        if (idx < 0 || idx == fileName.length() - 1) return "";
        return fileName.substring(idx + 1).toLowerCase();
    }
}

