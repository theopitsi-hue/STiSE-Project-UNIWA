package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.service.StoreService;
import com.github.theopitsihue.stise_springroll.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/stores")
public class StoreResource { //to api mas, gia na mporei na sindethei kai na parei plirofories to front-end
    private final StoreService storeService;

    public StoreResource(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping
    public <string> List<Store> getAllStores(@RequestParam(required = false) Set<String> category) {
        return storeService.getAllStores(category,0, 100).getContent();
    }

    //specific store
    @GetMapping("/{slug}") //ex. springroll/stores/ABCD -> test store profile
    public Store getStore(@PathVariable String slug) {
        return storeService.getStoreBySlug(slug);
    }

}
