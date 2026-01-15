package com.github.theopitsihue.stise_springroll.entity.request.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private long itemId;
    private String name;
    private BigDecimal price;
    private int quantity;
    private BigDecimal total;

    public CartItemResponse(long itemId, String name, BigDecimal price, int quantity) {
        this.itemId = itemId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        total = price.multiply(BigDecimal.valueOf(quantity));
    }
}

