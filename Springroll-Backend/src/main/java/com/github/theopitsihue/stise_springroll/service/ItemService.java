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

    public boolean itemExists(long id){
        return itemRepo.findById(id).isPresent();
    }

    public Item getItemByID(long id){
        return itemRepo.findById(id).orElseThrow(()->new RuntimeException("Item with id: "+id+" not found."));
    }


    public Item createItem(@NotNull Item item){
        return itemRepo.save(item);
    }

    public void deleteItemByID(Long id){
        itemRepo.deleteById(id);
    }

    public void deleteAll() {
        itemRepo.deleteAll();
    }

    public Item updateItem(Long itemId, Item updatedItem) {
        Item existing = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        existing.setName(updatedItem.getName());
        existing.setDescription(updatedItem.getDescription());
        existing.setPrice(updatedItem.getPrice());
        existing.setAvailable(updatedItem.isAvailable());
        existing.setItemGroupIds(updatedItem.getItemGroupIds());
        existing.setStore(updatedItem.getStore()); // keep the store reference if included

        return itemRepo.save(existing);
    }
}
