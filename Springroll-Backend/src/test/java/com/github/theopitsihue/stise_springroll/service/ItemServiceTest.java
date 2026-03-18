package com.github.theopitsihue.stise_springroll.service;


import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.entity.order.OrderStatus;
import com.github.theopitsihue.stise_springroll.repository.CartRepository;
import com.github.theopitsihue.stise_springroll.repository.ItemRepository;
import com.github.theopitsihue.stise_springroll.repository.OrderRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemService itemService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnAllItems() {
        Page<Item> page = mock(Page.class);

        when(itemRepository.findAll(any(PageRequest.class)))
                .thenReturn(page);

        Page<Item> result = itemService.getAllItems(0, 10);

        assertEquals(page, result);
        verify(itemRepository).findAll(any(PageRequest.class));
    }

    @Test
    void shouldReturnTrueIfItemExists() {
        UUID id = UUID.randomUUID();
        when(itemRepository.findById(id)).thenReturn(Optional.of(new Item()));

        assertTrue(itemService.itemExists(id));
    }

    @Test
    void shouldReturnFalseIfItemDoesNotExist() {
        UUID id = UUID.randomUUID();
        when(itemRepository.findById(id)).thenReturn(Optional.empty());

        assertFalse(itemService.itemExists(id));
    }

    @Test
    void shouldReturnItemById() {
        Item item = new Item();
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        Item result = itemService.getItemByID(1L);

        assertEquals(item, result);
    }

    @Test
    void shouldThrowWhenItemNotFound() {
        when(itemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            itemService.getItemByID(1L);
        });
    }

    @Test
    void shouldCreateItem() {
        Item item = new Item();

        when(itemRepository.save(item)).thenReturn(item);

        Item result = itemService.createItem(item);

        assertEquals(item, result);
        verify(itemRepository).save(item);
    }

    @Test
    void shouldDeleteItemById() {
        UUID id = UUID.randomUUID();

        itemService.deleteItemByID(id);

        verify(itemRepository).deleteById(id);
    }

    @Test
    void shouldDeleteAllItems() {
        itemService.deleteAll();

        verify(itemRepository).deleteAll();
    }
}
