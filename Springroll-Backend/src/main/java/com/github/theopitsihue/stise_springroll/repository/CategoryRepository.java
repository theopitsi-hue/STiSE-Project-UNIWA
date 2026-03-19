package com.github.theopitsihue.stise_springroll.repository;

import com.github.theopitsihue.stise_springroll.entity.Category;
import com.github.theopitsihue.stise_springroll.entity.Item;
import jakarta.annotation.Nonnull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Nonnull
    Optional<Category> findById(@Nonnull Long id);
    Optional<Category> findByName(String name);
    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);

}

