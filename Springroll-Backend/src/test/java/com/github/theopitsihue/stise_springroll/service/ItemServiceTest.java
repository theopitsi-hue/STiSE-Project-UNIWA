package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ItemServiceTest {

    private ItemRepository itemRepo;
    private ItemService itemService;

    @BeforeEach
    void setup() {
        itemRepo = mock(ItemRepository.class);
        itemService = new ItemService(itemRepo);
    }

    @Test
    void testGetAllItems() {
        Item i1 = new Item();
        i1.setId(1L);
        Item i2 = new Item();
        i2.setId(2L);
        Page<Item> page = new PageImpl<>(List.of(i1, i2));

        when(itemRepo.findAll(PageRequest.of(0, 2, Sort.by("id")))).thenReturn(page);

        Page<Item> result = itemService.getAllItems(0, 2);
        assertEquals(2, result.getContent().size());
        verify(itemRepo).findAll(PageRequest.of(0, 2, Sort.by("id")));
    }

    @Test
    void testItemExists() {
        when(itemRepo.findById(1L)).thenReturn(Optional.of(new Item()));
        when(itemRepo.findById(2L)).thenReturn(Optional.empty());

        assertTrue(itemService.itemExists(1L));
        assertFalse(itemService.itemExists(2L));
    }

    @Test
    void testGetItemByIDFound() {
        Item item = new Item();
        when(itemRepo.findById(1L)).thenReturn(Optional.of(item));

        Item result = itemService.getItemByID(1L);
        assertEquals(item, result);
    }

    @Test
    void testGetItemByIDNotFound() {
        when(itemRepo.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> itemService.getItemByID(1L));
        assertTrue(ex.getMessage().contains("Item with id: 1 not found"));
    }

    @Test
    void testCreateItem() {
        Item item = new Item();
        when(itemRepo.save(item)).thenReturn(item);

        Item result = itemService.createItem(item);
        assertEquals(item, result);
        verify(itemRepo).save(item);
    }

    @Test
    void testDeleteItemByID() {
        itemService.deleteItemByID(1L);
        verify(itemRepo).deleteById(1L);
    }

    @Test
    void testDeleteAll() {
        itemService.deleteAll();
        verify(itemRepo).deleteAll();
    }


    @Test
    void testUpdateItemNotFound() {
        when(itemRepo.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> itemService.updateItem(1L, new Item()));
        assertEquals("Item not found", ex.getMessage());
    }
}