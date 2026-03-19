package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.Category;
import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.repository.CategoryRepository;
import com.github.theopitsihue.stise_springroll.repository.ItemRepository;
import com.github.theopitsihue.stise_springroll.utilities.Utils;
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
@Transactional(rollbackOn = Exception.class) //USED FOR SHOOOOP Categories, not items!!
public class CategoryService {//business logic
    private final CategoryRepository catRepo;

    //Dependency injection
    public CategoryService(CategoryRepository catRepo) {
        this.catRepo = catRepo;
    }

    public Page<Category> getAllCategories(int page, int size){
        return catRepo.findAll(PageRequest.of(page,size, Sort.by("name")));
    }

    public boolean categoryExists(Long id){
        return catRepo.findById(id).isPresent();
    }

    public Category getCategoryByID(Long id){
        return catRepo.findById(id).orElseThrow(()->new RuntimeException("Category with id: "+id+" not found."));
    }

    public Category createCategory(@NotNull Category cat){
        cat.setSlug(Utils.generateUniqueSlug(cat.getName(),catRepo::existsBySlug));
        return catRepo.save(cat);
    }

    public void deleteCategoryByID(Long id){
        catRepo.deleteById(id);
    }

    public void deleteAll() {
        catRepo.deleteAll();
    }
}

