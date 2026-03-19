package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.entity.order.OrderStatus;
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

class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateOrderFromCart() {
        Cart cart = mock(Cart.class);
        UserAddress address = mock(UserAddress.class);

        when(cart.getItems()).thenReturn(new ArrayList<>());
        when(cart.getFinalPrice()).thenReturn(BigDecimal.valueOf(20.0));

        when(orderRepository.save(any(Order.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Order result = orderService.createFromCart(cart, address);

        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(20.0), result.getTotalPrice());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(address, result.getAddress());

        verify(orderRepository, times(1)).save(any(Order.class));
    }

    private void assertNotNull(Order result) {
    }

    @Test
    void shouldReturnOrderById() {
        Order order = new Order();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Order result = orderService.getByID(1L);

        assertEquals(order, result);
    }

    @Test
    void shouldThrowWhenOrderNotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            orderService.getByID(1L);
        });
    }

    @Test
    void shouldReturnTrueIfExists() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(new Order()));

        assertTrue(orderService.exists(1L));
    }

    @Test
    void shouldUpdateStatusIfDifferent() {
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);

        orderService.setStatus(order, OrderStatus.COMPLETED);

        assertEquals(OrderStatus.COMPLETED, order.getStatus());
        Assertions.assertNotNull(order.getLastUpdateStatusAt());
    }

    @Test
    void shouldNotUpdateIfSameStatus() {
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);

        orderService.setStatus(order, OrderStatus.PENDING);

        assertNull(order.getLastUpdateStatusAt());
    }

    @Test
    void shouldDeleteOrder() {
        orderService.delete(1L);

        verify(orderRepository).deleteById(1L);
    }
}
