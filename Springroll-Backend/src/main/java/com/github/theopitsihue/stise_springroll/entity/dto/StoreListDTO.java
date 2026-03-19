package com.github.theopitsihue.stise_springroll.entity.dto;

import com.github.theopitsihue.stise_springroll.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StoreListDTO {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private int deliveryTime;
    private BigInteger minOrder;
    private String ownerEmail;
    private List<Category> categories;
}
