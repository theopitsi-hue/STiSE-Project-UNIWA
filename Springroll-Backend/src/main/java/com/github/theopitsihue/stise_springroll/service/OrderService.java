package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.entity.order.OrderItem;
import com.github.theopitsihue.stise_springroll.entity.order.OrderStatus;
import com.github.theopitsihue.stise_springroll.repository.OrderRepository;
import com.github.theopitsihue.stise_springroll.repository.ItemRepository;
import com.github.theopitsihue.stise_springroll.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class OrderService {
    private final OrderRepository orderRepo;

    //Dependency injection
    public OrderService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    public Page<Order> getAll(int page, int size){
        return orderRepo.findAll(PageRequest.of(page,size, Sort.by("id")));
    }

    public boolean exists(long id){
        return orderRepo.findById(id).isPresent();
    }

    public Order getByID(long id){
        return orderRepo.findById(id).orElseThrow(()->new RuntimeException("Order with id: "+id+" not found."));
    }

    public Order createFromCart(@NotNull Cart cart, @NotNull UserAddress address){
        Order order = Order.builder().user(cart.getUser()).status(OrderStatus.PENDING).store(cart.getStore()).build();
        cart.getItems().forEach(item ->{
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .item(item.getItem())
                    .quantity(item.getQuantity())
                    .priceAtOrder(item.getItem().getPrice())
                    .itemNameAtOrder(item.getItem().getName())
                    .build();

            if (order.getItems() == null) order.setItems(new ArrayList<>());

            order.getItems().add(orderItem);
        });
        order.setTotalPrice(cart.getFinalPrice());
        order.setCreatedAt(LocalDateTime.now());
        order.setAddress(address);
        order.setStatus(OrderStatus.PENDING);

        return orderRepo.save(order);
    }

    public Order create(@NotNull Order entity){
        entity.setCreatedAt(LocalDateTime.now());
        return orderRepo.save(entity);
    }

    public void delete(long id){
        orderRepo.deleteById(id);
    }

    public void deleteAll() {
        orderRepo.deleteAll();
    }

    public List<Order> getByUserID(UUID id) {
        return orderRepo.findByUserId(id).get();
    }

    public void setStatus(Order order, OrderStatus orderStatus) {
        if (order.getStatus() != orderStatus) {
            order.setStatus(orderStatus);
            order.setLastUpdateStatusAt(LocalDateTime.now());
        }
    }
}
