package com.github.theopitsihue.stise_springroll.entity.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemDTO {
    private long id;
    private String name;
    private String description;
    private BigDecimal price;
    private boolean available;
    private Set<String> itemGroupIds;
}