package com.infosys.carbonfootprint.controller;

import com.infosys.carbonfootprint.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

/**
 * Public controller for uploading Government ID documents during user registration.
 * Files are stored locally under the configured upload directory.
 */
@RestController
@RequestMapping("/api/v1/public")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @Value("${app.upload.dir:uploads/government-ids}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    private static final java.util.Set<String> ALLOWED_TYPES = java.util.Set.of(
            "image/jpeg", "image/png", "application/pdf", "image/jpg"
    );

    @PostMapping("/upload-document")
    public ResponseEntity<ApiResponse<String>> uploadDocument(
            @RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No file selected. Please upload a valid document."));
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("File size exceeds the maximum limit of 10 MB."));
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid file type. Allowed types: JPEG, PNG, PDF."));
        }

        try {
            // Create upload directory if it does not exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate a unique filename to prevent collisions/overwriting
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/" + uploadDir + "/" + uniqueFilename;
            logger.info("Government ID document uploaded successfully: {}", fileUrl);

            return ResponseEntity.ok(ApiResponse.success(
                    "Document uploaded successfully!", fileUrl));

        } catch (IOException e) {
            logger.error("Failed to save uploaded file: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to save document. Please try again."));
        }
    }
}
