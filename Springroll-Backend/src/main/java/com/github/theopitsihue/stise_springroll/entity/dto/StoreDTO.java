package com.github.theopitsihue.stise_springroll.entity.dto;

import com.github.theopitsihue.stise_springroll.entity.Category;
import lombok.*;

import java.math.BigInteger;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreDTO {
    private UUID id;
    private String name;
    private String description;
    private String slug;

    private List<ItemDTO> items;
    private Set<ItemGroupDTO> itemGroups;

    private int deliveryTime;
    private BigInteger minOrder;

    private List<Category> categories;
}
