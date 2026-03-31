package com.rollout.app.controller;

import com.rollout.app.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/system")
@RequiredArgsConstructor
public class SystemController {

    private final FileStorageService fileStorageService;

    @GetMapping("/storage")
    public Map<String, String> storageInfo() {
        return Map.of(
                "mode", fileStorageService.storageMode(),
                "cloudinary", fileStorageService.cloudinarySummary()
        );
    }
}

