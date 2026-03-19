package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.config.security.CustomUserDetails;
import com.github.theopitsihue.stise_springroll.entity.Category;
import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.dto.StoreDTO;
import com.github.theopitsihue.stise_springroll.entity.dto.StoreListDTO;
import com.github.theopitsihue.stise_springroll.entity.dto.StoreMapper;
import com.github.theopitsihue.stise_springroll.request.StoreRequest;
import com.github.theopitsihue.stise_springroll.service.CategoryService;
import com.github.theopitsihue.stise_springroll.service.StoreService;
import com.github.theopitsihue.stise_springroll.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.*;

@RestController
@RequestMapping("/api/stores")
public class StoreResource { //to api mas, gia na mporei na sindethei kai na parei plirofories to front-end
    private final StoreService storeService;
    private final CategoryService categoryService;
    private final UserService userService;

    public StoreResource(StoreService storeService, CategoryService categoryService, UserService userService) {
        this.storeService = storeService;
        this.categoryService = categoryService;
        this.userService = userService;
    }

    @GetMapping
    public List<StoreListDTO> getAllStores(
            @AuthenticationPrincipal CustomUserDetails userIn,
            @RequestParam(required = false) Set<String> category
    ) {
        return storeService.getAllStores(0, 100)
                .getContent()
                .stream()
                .map(StoreMapper::toListDTO)
                .toList();
    }

    //specific store
    @GetMapping("/{slug}") //ex. springroll/stores/ABCD -> test store profile
    public ResponseEntity<StoreDTO> getStore(@AuthenticationPrincipal CustomUserDetails userIn, @PathVariable String slug) {
        Optional<Store> store =  storeService.getStoreBySlug(slug);
        return ResponseEntity.ok(StoreMapper.toDTO(store.get()));
    }

    @PostMapping
    public ResponseEntity<?> createStore(
            @AuthenticationPrincipal CustomUserDetails userIn,
            @RequestBody StoreRequest request
    ) {
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
            User owner = userService.getUserByEmail(request.getOwnerEmail());
            if (owner.getPrivilege() == User.Role.CLIENT){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Provided user is not an owner account.");
            }

            Set<Category> categories = categoryService.getCategoriesByIds(request.getCategories());

            Store store = new Store();
            store.setName(request.getName());
            store.setDescription(request.getDescription());
            store.setMinOrder(BigInteger.valueOf(request.getMinOrder()));
            store.setDeliveryTime(request.getDeliveryTime());
            store.setOwner(owner);
            store.setCategories(categories);

            Store saved = storeService.createStore(store);

            return ResponseEntity.ok(StoreMapper.toDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStore(
            @AuthenticationPrincipal CustomUserDetails userIn,
            @PathVariable UUID id,
            @RequestBody StoreRequest request
    ) {
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
            Store store = storeService.getStoreByID(id);

            User owner = userService.getUserByEmail(request.getOwnerEmail());
            Set<Category> categories = categoryService.getCategoriesByIds(request.getCategories());


            store.setName(request.getName());
            store.setDescription(request.getDescription());
            store.setMinOrder(BigInteger.valueOf(request.getMinOrder()));
            store.setDeliveryTime(request.getDeliveryTime());
            store.setOwner(owner);
            store.setCategories(categories);

            Store updated = storeService.save(store);

            return ResponseEntity.ok(StoreMapper.toDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStore(
            @AuthenticationPrincipal CustomUserDetails userIn,
            @PathVariable UUID id
    ) {
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
            storeService.deleteStoreByID(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
