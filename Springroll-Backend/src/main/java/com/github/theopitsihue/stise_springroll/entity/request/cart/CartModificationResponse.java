package com.github.theopitsihue.stise_springroll.entity.request.cart;

import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartModificationResponse {
    private List<CartItemResponse> items = new ArrayList<>();
    private BigDecimal finalPrice;

    public CartModificationResponse fromCart(Cart cart){
        finalPrice = BigDecimal.ZERO;
        items = new ArrayList<>();
        cart.getItems().forEach(item -> {
            CartItemResponse cartItem = new CartItemResponse(
                    item.getItem().getId(),
                    item.getItem().getName(),
                    item.getItem().getPrice(),
                    item.getQuantity()
            );
            items.add(cartItem);
            finalPrice = finalPrice.add(cartItem.getTotal());
        });
        return this;
    }
}
