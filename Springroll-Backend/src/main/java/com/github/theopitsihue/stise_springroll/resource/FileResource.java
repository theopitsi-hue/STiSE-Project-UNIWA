package com.github.theopitsihue.stise_springroll.resource;


import com.github.theopitsihue.stise_springroll.request.FileUploadRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@RestController
@RequestMapping("/api/photos")
public class FileResource {

    private static final String UPLOAD_DIR = "media/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPhoto(@RequestParam(value = "file", required = false) MultipartFile file,
                                                      @RequestParam(value = "filename", required = false) String filename) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }

        try {
            String fil = StringUtils.cleanPath(filename);
            Path uploadPath = Paths.get(System.getProperty("user.dir"), UPLOAD_DIR);


            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fil);
            ensureFilePath(filePath.toAbsolutePath().toString());
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }
            file.transferTo(filePath.toFile());

            return ResponseEntity.ok("File uploaded successfully: " + fil);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }

    public static Path ensureFilePath(String fullFilePath) throws IOException {
        Path filePath = Paths.get(fullFilePath);
        Path parentDir = filePath.getParent();

        if (parentDir != null && !Files.exists(parentDir)) {
            Files.createDirectories(parentDir); // creates all missing directories
        }

        return filePath;
    }
}
