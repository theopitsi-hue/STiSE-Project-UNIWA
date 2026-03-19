package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.service.CategoryService;
import com.github.theopitsihue.stise_springroll.service.ItemService;
import com.github.theopitsihue.stise_springroll.service.StoreService;
import com.github.theopitsihue.stise_springroll.service.UserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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



}
