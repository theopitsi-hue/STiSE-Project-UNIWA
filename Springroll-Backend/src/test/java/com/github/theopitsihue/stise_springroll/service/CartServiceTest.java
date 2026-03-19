package com.github.theopitsihue.stise_springroll.service;


import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.repository.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartServiceTest {

    private CartRepository cartRepository;
    private CartService cartService;

    @BeforeEach
    void setup() {
        cartRepository = mock(CartRepository.class);
        cartService = new CartService(cartRepository);
    }

    @Test
    void testGetAll() {
        Cart cart1 = Cart.builder().id(1L).build();
        Cart cart2 = Cart.builder().id(2L).build();
        Page<Cart> page = new PageImpl<>(List.of(cart1, cart2));

        when(cartRepository.findAll(PageRequest.of(0, 2, Sort.by("id")))).thenReturn(page);

        Page<Cart> result = cartService.getAll(0, 2);

        assertEquals(2, result.getContent().size());
        verify(cartRepository).findAll(PageRequest.of(0, 2, Sort.by("id")));
    }

    @Test
    void testExists() {
        when(cartRepository.findById(1L)).thenReturn(Optional.of(new Cart()));
        when(cartRepository.findById(2L)).thenReturn(Optional.empty());

        assertTrue(cartService.exists(1L));
        assertFalse(cartService.exists(2L));
    }

    @Test
    void testGetByIDFound() {
        Cart cart = Cart.builder().id(1L).build();
        when(cartRepository.findById(1L)).thenReturn(Optional.of(cart));

        Cart result = cartService.getByID(1L);
        assertEquals(cart, result);
    }

    @Test
    void testGetByIDNotFound() {
        when(cartRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> cartService.getByID(1L));
        assertTrue(exception.getMessage().contains("Cart with id: 1 not found"));
    }

    @Test
    void testCreate() {
        Cart cart = Cart.builder().build();
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> i.getArgument(0));

        Cart saved = cartService.create(cart);
        assertNotNull(saved.getUpdatedAt());
        verify(cartRepository).save(cart);
    }

    @Test
    void testDelete() {
        cartService.delete(1L);
        verify(cartRepository).deleteById(1L);
    }

    @Test
    void testDeleteAll() {
        cartService.deleteAll();
        verify(cartRepository).deleteAll();
    }

    @Test
    void testFindByUser() {
        User user = new User();
        Cart cart = Cart.builder().user(user).build();
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        Optional<Cart> result = cartService.findByUser(user);
        assertTrue(result.isPresent());
        assertEquals(user, result.get().getUser());
    }

    @Test
    void testSave() {
        Cart cart = Cart.builder().build();
        cartService.save(cart);
        verify(cartRepository).save(cart);
    }

    @Test
    void testGetOrCreateExistingCart() {
        User user = new User();
        Store store = new Store();
        Cart cart = Cart.builder().user(user).store(store).build();

        when(cartRepository.findByUserAndStore(user, store)).thenReturn(Optional.of(cart));

        Cart result = cartService.getOrCreate(user, store);
        assertEquals(cart, result);
        verify(cartRepository, never()).save(any());
    }

    @Test
    void testGetOrCreateNewCart() {
        User user = new User();
        Store store = new Store();

        when(cartRepository.findByUserAndStore(user, store)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> i.getArgument(0));

        Cart result = cartService.getOrCreate(user, store);

        assertNotNull(result);
        assertEquals(user, result.getUser());
        assertEquals(store, result.getStore());
        assertNotNull(result.getUpdatedAt());
        verify(cartRepository).save(result);
    }

    @Test
    void testGetOrCreateWithNullArguments() {
        assertThrows(IllegalArgumentException.class, () -> cartService.getOrCreate(null, new Store()));
        assertThrows(IllegalArgumentException.class, () -> cartService.getOrCreate(new User(), null));
    }
}