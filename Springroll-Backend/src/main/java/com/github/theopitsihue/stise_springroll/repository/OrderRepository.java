package com.github.theopitsihue.stise_springroll.repository;

import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import jakarta.annotation.Nonnull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Nonnull
    Optional<Order> findById(@Nonnull Long id);
    @Nonnull
    Optional<List<Order>> findByUserId( @Nonnull UUID userId);

    @Nonnull
    Optional<List<Order>> findByStore(Store store);
    @Nonnull
    Optional<List<Order>> findByUserAndStore(User user, Store store);

}

