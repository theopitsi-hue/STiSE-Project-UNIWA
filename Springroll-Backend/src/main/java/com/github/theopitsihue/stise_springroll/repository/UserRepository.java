package com.github.theopitsihue.stise_springroll.repository;

import com.github.theopitsihue.stise_springroll.entity.User;
import jakarta.annotation.Nonnull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    @Nonnull
    Optional<User> findById(@Nonnull UUID id);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

}
