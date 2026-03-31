package com.rollout.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.nio.file.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {
    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final Path uploadRoot;
    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;
    private final String cloudinaryFolder;
    private final String cloudinaryUrl;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public FileStorageService(
            @Value("${app.upload.dir:uploads}") String uploadDir,
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret,
            @Value("${cloudinary.folder:rollout}") String cloudinaryFolder,
            @Value("${cloudinary.url:}") String cloudinaryUrl
    ) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.cloudinaryUrl = cloudinaryUrl == null ? "" : cloudinaryUrl.trim();

        // Support either explicit fields OR CLOUDINARY_URL format.
        String resolvedCloud = safe(cloudName);
        String resolvedKey = safe(apiKey);
        String resolvedSecret = safe(apiSecret);
        if ((resolvedCloud.isBlank() || resolvedKey.isBlank() || resolvedSecret.isBlank()) && !this.cloudinaryUrl.isBlank()) {
            CloudinaryCreds parsed = parseCloudinaryUrl(this.cloudinaryUrl);
            if (resolvedCloud.isBlank()) resolvedCloud = parsed.cloudName;
            if (resolvedKey.isBlank()) resolvedKey = parsed.apiKey;
            if (resolvedSecret.isBlank()) resolvedSecret = parsed.apiSecret;
        }
        this.cloudName = resolvedCloud;
        this.apiKey = resolvedKey;
        this.apiSecret = resolvedSecret;
        this.cloudinaryFolder = cloudinaryFolder;
    }

    @PostConstruct
    void logStorageMode() {
        if (isCloudinaryEnabled()) {
            log.info("Image storage mode: CLOUDINARY (cloud='{}', folder='{}')", cloudName, cloudinaryFolder);
        } else {
            log.warn("Image storage mode: LOCAL FILESYSTEM (Cloudinary credentials missing)");
        }
    }

    public String saveImage(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image uploads are supported");
        }
        if (isCloudinaryEnabled()) {
            return saveImageToCloudinary(file, folder);
        }
        return saveImageLocally(file, folder);
    }

    public void deleteByUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;
        if (isCloudinaryEnabled() && imageUrl.contains("res.cloudinary.com/" + cloudName + "/")) {
            deleteFromCloudinary(imageUrl);
            return;
        }
        deleteLocallyByUrl(imageUrl);
    }

    private String saveImageLocally(MultipartFile file, String folder) {
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

    private void deleteLocallyByUrl(String imageUrl) {
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

    private boolean isCloudinaryEnabled() {
        return !cloudName.isBlank() && !apiKey.isBlank() && !apiSecret.isBlank();
    }

    public String storageMode() {
        return isCloudinaryEnabled() ? "CLOUDINARY" : "LOCAL";
    }

    public String cloudinarySummary() {
        if (!isCloudinaryEnabled()) return "disabled";
        return "cloud=" + cloudName + ", folder=" + cloudinaryFolder;
    }

    private String saveImageToCloudinary(MultipartFile file, String folder) {
        long timestamp = Instant.now().getEpochSecond();
        String effectiveFolder = buildFolder(folder);
        String signatureSource = "folder=" + effectiveFolder + "&timestamp=" + timestamp + apiSecret;
        String signature = sha1Hex(signatureSource);

        try {
            String boundary = "----RollOutBoundary" + UUID.randomUUID();
            byte[] body = buildMultipartBody(boundary, file, timestamp, effectiveFolder, signature);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload"))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cloudinary upload failed");
            }
            JsonNode json = objectMapper.readTree(response.body());
            String secureUrl = json.path("secure_url").asText("");
            if (secureUrl.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cloudinary did not return image URL");
            }
            return secureUrl;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cloudinary upload interrupted");
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cloudinary upload failed");
        }
    }

    private void deleteFromCloudinary(String imageUrl) {
        String publicId = extractPublicId(imageUrl);
        if (publicId.isBlank()) return;
        long timestamp = Instant.now().getEpochSecond();
        String signatureSource = "public_id=" + publicId + "&timestamp=" + timestamp + apiSecret;
        String signature = sha1Hex(signatureSource);
        try {
            String body = "public_id=" + enc(publicId) +
                    "&timestamp=" + timestamp +
                    "&api_key=" + enc(apiKey) +
                    "&signature=" + enc(signature);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/image/destroy"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception ignored) {
            // Non-fatal: deletion cleanup should not block app flow.
        }
    }

    private byte[] buildMultipartBody(String boundary, MultipartFile file, long timestamp, String folder, String signature) throws IOException {
        List<byte[]> parts = new ArrayList<>();
        parts.add(fieldPart(boundary, "api_key", apiKey));
        parts.add(fieldPart(boundary, "timestamp", String.valueOf(timestamp)));
        parts.add(fieldPart(boundary, "folder", folder));
        parts.add(fieldPart(boundary, "signature", signature));
        parts.add(filePart(boundary, "file", file.getOriginalFilename(), file.getBytes(), file.getContentType()));
        parts.add(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        for (byte[] p : parts) out.write(p);
        return out.toByteArray();
    }

    private byte[] fieldPart(String boundary, String name, String value) {
        String part = "--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n" +
                value + "\r\n";
        return part.getBytes(StandardCharsets.UTF_8);
    }

    private byte[] filePart(String boundary, String name, String filename, byte[] content, String contentType) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        String header = "--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + (filename == null ? "upload.jpg" : filename) + "\"\r\n" +
                "Content-Type: " + (contentType == null ? "application/octet-stream" : contentType) + "\r\n\r\n";
        out.write(header.getBytes(StandardCharsets.UTF_8));
        out.write(content);
        out.write("\r\n".getBytes(StandardCharsets.UTF_8));
        return out.toByteArray();
    }

    private String extractPublicId(String imageUrl) {
        int marker = imageUrl.indexOf("/upload/");
        if (marker < 0) return "";
        String path = imageUrl.substring(marker + "/upload/".length());
        path = path.replaceFirst("^v\\d+/", "");
        int dot = path.lastIndexOf('.');
        if (dot > 0) path = path.substring(0, dot);
        return path;
    }

    private String buildFolder(String folder) {
        if (folder == null || folder.isBlank()) return cloudinaryFolder;
        return cloudinaryFolder + "/" + folder;
    }

    private String sha1Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to sign Cloudinary request");
        }
    }

    private String enc(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    private CloudinaryCreds parseCloudinaryUrl(String url) {
        // Expected: cloudinary://api_key:api_secret@cloud_name
        try {
            URI uri = URI.create(url);
            String userInfo = uri.getUserInfo() == null ? "" : uri.getUserInfo();
            String[] parts = userInfo.split(":", 2);
            String key = parts.length > 0 ? parts[0] : "";
            String secret = parts.length > 1 ? parts[1] : "";
            String cloud = uri.getHost() == null ? "" : uri.getHost();
            return new CloudinaryCreds(cloud, key, secret);
        } catch (Exception ignored) {
            return new CloudinaryCreds("", "", "");
        }
    }

    private record CloudinaryCreds(String cloudName, String apiKey, String apiSecret) {}
}

