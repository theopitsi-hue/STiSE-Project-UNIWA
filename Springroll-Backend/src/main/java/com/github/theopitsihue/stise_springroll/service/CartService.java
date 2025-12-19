package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.repository.CartRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class CartService {
    private final CartRepository cartRepository;
    //Dependency injection
    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public Page<Cart> getAll(int page, int size){
        return cartRepository.findAll(PageRequest.of(page,size, Sort.by("id")));
    }

    public boolean exists(long id){
        return cartRepository.findById(id).isPresent();
    }

    public Cart getByID(long id){
        return cartRepository.findById(id).orElseThrow(()->new RuntimeException("Cart with id: "+id+" not found."));
    }

    public Cart create(@NotNull Cart entity){
        return cartRepository.save(entity);
    }

    public void delete(long id){
        cartRepository.deleteById(id);
    }

    public void deleteAll() {
        cartRepository.deleteAll();
    }
}
