package com.github.theopitsihue.stise_springroll.service;


import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.repository.ItemRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class ItemService { //business logic
    private final ItemRepository itemRepo;

    //Dependency injection
    public ItemService(ItemRepository userRepo) {
        this.itemRepo = userRepo;
    }

    public Page<Item> getAllItems(int page, int size){
        return itemRepo.findAll(PageRequest.of(page,size, Sort.by("id")));
    }

    public boolean itemExists(UUID id){
        return itemRepo.findById(id).isPresent();
    }

    public Item getItemByID(UUID id){
        return itemRepo.findById(id).orElseThrow(()->new RuntimeException("Item with id: "+id+" not found."));
    }

    public Item createItem(@NotNull Item store){
        return itemRepo.save(store);
    }

    public void deleteItemByID(UUID id){
        itemRepo.deleteById(id);
    }

    public void deleteAll() {
        itemRepo.deleteAll();
    }
}
