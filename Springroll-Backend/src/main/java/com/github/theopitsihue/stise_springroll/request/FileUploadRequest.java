package com.github.theopitsihue.stise_springroll.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FileUploadRequest {
    MultipartFile file;
    String filename;
}
