package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.config.security.CustomUserDetails;
import com.github.theopitsihue.stise_springroll.entity.Category;
import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.service.CategoryService;
import com.github.theopitsihue.stise_springroll.service.StoreService;
import com.github.theopitsihue.stise_springroll.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/stores")
public class StoreResource { //to api mas, gia na mporei na sindethei kai na parei plirofories to front-end
    private final StoreService storeService;
    private final CategoryService categoryService;

    public StoreResource(StoreService storeService, CategoryService categoryService) {
        this.storeService = storeService;
        this.categoryService = categoryService;
    }

    @GetMapping
    public <string> List<Store> getAllStores(@AuthenticationPrincipal CustomUserDetails userIn, @RequestParam(required = false) Set<String> category) {
        return storeService.getAllStores(category,0, 100).getContent();
    }

    @GetMapping("/categories")
    public <string> List<Category> getStoreCategories(@AuthenticationPrincipal CustomUserDetails userIn) {

        return categoryService.getAllCategories(0, 100).getContent();
    }


    //specific store
    @GetMapping("/{slug}") //ex. springroll/stores/ABCD -> test store profile
    public Store getStore(@AuthenticationPrincipal CustomUserDetails userIn, @PathVariable String slug) {
        return storeService.getStoreBySlug(slug);
    }

}
