package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.entity.order.OrderStatus;
import com.github.theopitsihue.stise_springroll.repository.CartRepository;
import com.github.theopitsihue.stise_springroll.repository.OrderRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartService cartService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateCart() {
        Cart cart = new Cart();

        when(cartRepository.save(any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Cart result = cartService.create(cart);

        assertNotNull(result.getUpdatedAt());
        verify(cartRepository).save(cart);
    }

    @Test
    void shouldReturnCartById() {
        Cart cart = new Cart();
        when(cartRepository.findById(1L)).thenReturn(Optional.of(cart));

        Cart result = cartService.getByID(1L);

        assertEquals(cart, result);
    }

    @Test
    void shouldThrowWhenCartNotFound() {
        when(cartRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            cartService.getByID(1L);
        });
    }

    @Test
    void shouldReturnTrueIfCartExists() {
        when(cartRepository.findById(1L)).thenReturn(Optional.of(new Cart()));

        assertTrue(cartService.exists(1L));
    }

    @Test
    void shouldDeleteCart() {
        cartService.delete(1L);

        verify(cartRepository).deleteById(1L);
    }

    @Test
    void shouldFindCartByUser() {
        User user = new User();
        Cart cart = new Cart();

        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        Optional<Cart> result = cartService.findByUser(user);

        assertTrue(result.isPresent());
        assertEquals(cart, result.get());
    }

    @Test
    void shouldSaveCart() {
        Cart cart = new Cart();

        cartService.save(cart);

        verify(cartRepository).save(cart);
    }

    @Test
    void shouldReturnExistingCartInGetOrCreate() {
        User user = new User();
        Store store = new Store();
        Cart existingCart = new Cart();

        when(cartRepository.findByUserAndStore(user, store))
                .thenReturn(Optional.of(existingCart));

        Cart result = cartService.getOrCreate(user, store);

        assertEquals(existingCart, result);
        verify(cartRepository, never()).save(any());
    }

    @Test
    void shouldCreateNewCartIfNotExists() {
        User user = new User();
        Store store = new Store();

        when(cartRepository.findByUserAndStore(user, store))
                .thenReturn(Optional.empty());

        when(cartRepository.save(any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Cart result = cartService.getOrCreate(user, store);

        assertNotNull(result);
        assertEquals(user, result.getUser());
        assertEquals(store, result.getStore());
        assertNotNull(result.getUpdatedAt());

        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void shouldThrowIfUserOrStoreIsNull() {
        assertThrows(IllegalArgumentException.class, () -> {
            cartService.getOrCreate(null, new Store());
        });

        assertThrows(IllegalArgumentException.class, () -> {
            cartService.getOrCreate(new User(), null);
        });
    }
}
