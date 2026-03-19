package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.config.security.CustomUserDetails;
import com.github.theopitsihue.stise_springroll.entity.Category;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.request.CategoryRequest;
import com.github.theopitsihue.stise_springroll.service.CategoryService;
import com.github.theopitsihue.stise_springroll.service.StoreService;
import com.github.theopitsihue.stise_springroll.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores/categories")
public class CategoryResource {
    private final StoreService storeService;
    private final CategoryService categoryService;
    private final UserService userService;

    public CategoryResource(StoreService storeService, CategoryService categoryService, UserService userService) {
        this.storeService = storeService;
        this.categoryService = categoryService;
        this.userService = userService;
    }

    @GetMapping
    public <string> List<Category> getAllCategories(@AuthenticationPrincipal CustomUserDetails userIn) {
        return categoryService.getAllCategories(0, 10)
                .getContent();
    }

    @PostMapping
    public ResponseEntity<?> createCategory(
            @AuthenticationPrincipal CustomUserDetails userIn, @RequestBody CategoryRequest request) {
        if (userIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }
        User user = userService.getUserByUsername(userIn.getUsername());

        if (user.getPrivilege() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not an administrator!"));
        }
        try {
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }

            //check for duplicate name
            boolean exists = categoryService.existsByName(request.getName());
            if (exists) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Category with this name already exists");
            }

            Category category = new Category();
            category.setName(request.getName());
            category.setIconName(request.getIconName());
            category.setSortIndex(
                    request.getSortIndex() != null ? request.getSortIndex() : 0
            );

            Category saved = categoryService.createCategory(category);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request,
            @AuthenticationPrincipal CustomUserDetails userIn
    ) {
        if (userIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }

        User user = userService.getUserByUsername(userIn.getUsername());
        if (user.getPrivilege() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not an administrator!"));
        }

        try {
            Category category = categoryService.getCategoryByID(id);

            //check for duplicate name
            if (request.getName() != null && !request.getName().equals(category.getName())) {
                boolean exists = categoryService.existsByName(request.getName());
                if (exists) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Category with this name already exists");
                }
                category.setName(request.getName());
            }

            if (request.getSortIndex() != null) {
                category.setSortIndex(request.getSortIndex());
            }

            if (request.getIconName() != null) {
                category.setIconName(request.getIconName());
            }

            Category updated = categoryService.save(category);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(
            @AuthenticationPrincipal CustomUserDetails userIn, @PathVariable Long id) {

        if (userIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }
        User user = userService.getUserByUsername(userIn.getUsername());

        if (user.getPrivilege() != User.Role.ADMIN){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not an administrator!"));
        }

        try {
            categoryService.deleteCategoryByID(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}

