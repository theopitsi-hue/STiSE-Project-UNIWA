package com.github.theopitsihue.stise_springroll.repository;

import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import jakarta.annotation.Nonnull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface StoreRepository extends JpaRepository<Store, UUID> {
    @Nonnull
    Optional<Store> findById(@Nonnull UUID id);
    Optional<Store> findByName(String name);
    Optional<Store> findBySlug(String slug);
    boolean existsBySlug(String slug);

    Page<Store> findDistinctByCategories_NameIn(Set<String> names, Pageable pageable);

}

