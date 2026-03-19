package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    private OrderRepository orderRepo;
    private OrderService orderService;

    @BeforeEach
    void setup() {
        orderRepo = mock(OrderRepository.class);
        orderService = new OrderService(orderRepo);
    }

    @Test
    void testGetAll() {
        Order o1 = new Order();
        o1.setId(1L);
        Order o2 = new Order();
        o2.setId(2L);
        Page<Order> page = new PageImpl<>(List.of(o1, o2));

        when(orderRepo.findAll(PageRequest.of(0, 2, Sort.by("id")))).thenReturn(page);

        Page<Order> result = orderService.getAll(0, 2);
        assertEquals(2, result.getContent().size());
        verify(orderRepo).findAll(PageRequest.of(0, 2, Sort.by("id")));
    }

    @Test
    void testExists() {
        when(orderRepo.findById(1L)).thenReturn(Optional.of(new Order()));
        when(orderRepo.findById(2L)).thenReturn(Optional.empty());

        assertTrue(orderService.exists(1L));
        assertFalse(orderService.exists(2L));
    }

    @Test
    void testGetByIDFound() {
        Order order = new Order();
        when(orderRepo.findById(1L)).thenReturn(Optional.of(order));

        Order result = orderService.getByID(1L);
        assertEquals(order, result);
    }

    @Test
    void testGetByIDNotFound() {
        when(orderRepo.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> orderService.getByID(1L));
        assertTrue(ex.getMessage().contains("Order with id: 1 not found"));
    }

    @Test
    void testCreate() {
        Order order = new Order();
        when(orderRepo.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));

        Order result = orderService.create(order);
        assertNotNull(result.getCreatedAt());
        verify(orderRepo).save(order);
    }

    @Test
    void testDelete() {
        orderService.delete(1L);
        verify(orderRepo).deleteById(1L);
    }

    @Test
    void testDeleteAll() {
        orderService.deleteAll();
        verify(orderRepo).deleteAll();
    }

    @Test
    void testGetByUserIDFound() {
        UUID userId = UUID.randomUUID();
        Order o1 = new Order();
        Order o2 = new Order();
        when(orderRepo.findByUserId(userId)).thenReturn(Optional.of(List.of(o1, o2)));

        List<Order> result = orderService.getByUserID(userId);
        assertEquals(2, result.size());
        verify(orderRepo).findByUserId(userId);
    }

    @Test
    void testGetByUserIDEmpty() {
        UUID userId = UUID.randomUUID();
        when(orderRepo.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> orderService.getByUserID(userId));
    }
}