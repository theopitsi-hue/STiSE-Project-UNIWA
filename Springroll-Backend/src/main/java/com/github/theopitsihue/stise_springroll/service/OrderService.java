package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.order.Order;
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
}
