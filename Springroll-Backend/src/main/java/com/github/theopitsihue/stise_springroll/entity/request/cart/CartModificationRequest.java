package com.github.theopitsihue.stise_springroll.entity.request.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartModificationRequest {
    private long itemId;
    private int change;
    private boolean clear;
}