package com.github.theopitsihue.stise_springroll.entity.dto;

import com.github.theopitsihue.stise_springroll.entity.*;
import com.github.theopitsihue.stise_springroll.data.ItemGroup;

import java.util.stream.Collectors;

public class StoreMapper {

    public static StoreDTO toDTO(Store store) {
        return StoreDTO.builder()
                .id(store.getId())
                .name(store.getName())
                .description(store.getDescription())
                .slug(store.getSlug())
                .deliveryTime(store.getDeliveryTime())
                .minOrder(store.getMinOrder())

                .items(store.getItems().stream()
                        .map(StoreMapper::toDTO)
                        .collect(Collectors.toList()))

                .itemGroups(store.getItemGroups().stream()
                        .map(StoreMapper::toDTO)
                        .collect(Collectors.toSet()))
                .build();
    }

    public static ItemDTO toDTO(Item item) {
        return ItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .available(item.isAvailable())
                .itemGroupIds(item.getItemGroupIds())
                .build();
    }

    public static ItemGroupDTO toDTO(ItemGroup group) {
        return ItemGroupDTO.builder()
                .name(group.getName())
                .sortIndex(group.getSortIndex())
                .build();
    }

    public static StoreListDTO toListDTO(Store store) {
        return StoreListDTO.builder()
                .id(store.getId())
                .name(store.getName())
                .slug(store.getSlug())
                .description(store.getDescription())
                .deliveryTime(store.getDeliveryTime())
                .minOrder(store.getMinOrder())
                .ownerEmail(store.getOwner().getEmail())
                .categories(store.getCategories().stream().toList())
                .build();
    }
}
