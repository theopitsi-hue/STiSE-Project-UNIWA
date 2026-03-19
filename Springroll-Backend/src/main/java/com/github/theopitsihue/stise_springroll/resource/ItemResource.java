package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.service.CategoryService;
import com.github.theopitsihue.stise_springroll.service.ItemService;
import com.github.theopitsihue.stise_springroll.service.StoreService;
import com.github.theopitsihue.stise_springroll.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
public class ItemResource {
    private final ItemService itemService;
    private final UserService userService;
    private final StoreService storeService;

    public ItemResource(StoreService storeService, ItemService itemService, UserService userService) {
        this.storeService = storeService;
        this.userService = userService;
        this.itemService = itemService;
    }

    // Get a single item by ID
    @GetMapping("/{itemId}")
    public ResponseEntity<Item> getItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.getItemByID(itemId));
    }

    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        return ResponseEntity.ok(itemService.createItem(item));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<Item> updateItem(@PathVariable Long itemId, @RequestBody Item item) {
        return ResponseEntity.ok(itemService.updateItem(itemId, item));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        itemService.deleteItemByID(itemId);
        return ResponseEntity.noContent().build();
    }
}
