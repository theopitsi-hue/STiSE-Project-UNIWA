package com.github.theopitsihue.stise_springroll.entity.order;

import java.util.List;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {

        List<OrderItemDTO> items = order.getItems().stream()
                .map(OrderMapper::toItemDTO)
                .toList();

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .addressId(order.getAddress() != null ? order.getAddress().getId() : null)
                .items(items)
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .createdAt(order.getCreatedAt())
                .storeName(order.getStore().getName())
                .lastUpdateStatusAt(order.getLastUpdateStatusAt())
                .build();
    }

    private static OrderItemDTO toItemDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .itemId(item.getItem().getId())
                .itemName(item.getItemNameAtOrder())
                .quantity(item.getQuantity())
                .priceAtOrder(item.getPriceAtOrder())
                .storeID(item.getItem().getStore() != null ? item.getItem().getStore().getId() : null)
                .build();
    }
}