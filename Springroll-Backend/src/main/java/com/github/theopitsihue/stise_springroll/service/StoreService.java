package com.github.theopitsihue.stise_springroll.service;


import com.github.theopitsihue.stise_springroll.data.WeekScedule.WeekSchedule;
import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.repository.StoreRepository;
import com.github.theopitsihue.stise_springroll.utilities.Utils;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class StoreService { //business logic
    private final StoreRepository storeRepo;

    //Dependency injection
    public StoreService(StoreRepository userRepo) {
        this.storeRepo = userRepo;
    }

    public Page<Store> getAllStores(int page, int size){
        return storeRepo.findAll(PageRequest.of(page,size, Sort.by("id")));
    }

    public Page<Store> getAllStores(Set<String> categories, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));

        if (categories == null || categories.isEmpty()) {
            return storeRepo.findAll(pageable);
        }

        return storeRepo.findDistinctByCategories_NameIn(categories, pageable);
    }



    public boolean storeExists(UUID id){
        return storeRepo.findById(id).isPresent();
    }

    public Store getStoreByID(UUID id){
        return storeRepo.findById(id).orElseThrow(()->new RuntimeException("Store with id: "+id+" not found."));
    }

    public Store getStoreByID(String id){
        return getStoreByID(UUID.fromString(id));
    }

    public Store getStoreBySlug(String slug){
        return storeRepo.findBySlug(slug).orElseThrow(()->new RuntimeException("Store with slug: "+slug+" not found."));
    }

    public Store createStore(@NotNull Store store){
        String uniqueSlug = Utils.generateUniqueSlug(store.getName(), storeRepo::existsBySlug);
        store.setSlug(uniqueSlug);
        return storeRepo.save(store);
    }


    public  void deleteStoreByID(UUID id){
        storeRepo.deleteById(id);
    }

    public void deleteAll() {
        storeRepo.deleteAll();
    }

    /// Checks if a user can edit a store based on their access level.
    public boolean canEditStore(User user, Store store) {
        if (user.getPrivilege() == User.Role.ADMIN) return true;
        if (user.getPrivilege() ==  User.Role.SHOP_OWNER && store.getOwners().contains(user)) return true;
        return false;
    }

    public Store updateStore(UUID id, Store updatedStore, User currentUser) {
        Store old_store = getStoreByID(id);

        if (!canEditStore(currentUser, old_store)) {
            throw new RuntimeException("Unauthorized Store Update.");
        }

        // update logic...
        return storeRepo.save(old_store);
    }


    public boolean isStoreOpen(UUID id, DayOfWeek day, LocalTime time){
        var store  = getStoreByID(id);
        if (store.isForceClosed()) return false;
        return store.getSchedule().isOpen(day,time);
    }

    public boolean isStoreOpen(String slug, DayOfWeek day, LocalTime time){
        var store  = getStoreBySlug(slug);
        if (store.isForceClosed()) return false;
        return store.getSchedule().isOpen(day,time);
    }

    public WeekSchedule getStoreScheduleBySlug(String slug){
        return getStoreBySlug(slug).getSchedule();
    }
}
