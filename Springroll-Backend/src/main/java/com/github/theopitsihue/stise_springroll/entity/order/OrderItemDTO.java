package com.github.theopitsihue.stise_springroll.entity.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItemDTO {

    private Long itemId;

    private String itemName;

    private Integer quantity;

    private BigDecimal priceAtOrder;
    private UUID storeID;
}
