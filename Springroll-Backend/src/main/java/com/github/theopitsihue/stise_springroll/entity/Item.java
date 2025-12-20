package com.github.theopitsihue.stise_springroll.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.github.theopitsihue.stise_springroll.data.ItemGroup;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        name = "dbl_item"
)
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    @JsonBackReference
    private Store store; // The store this item belongs to


    @Column(nullable = false)
    @Builder.Default //if this item is available to order
    private boolean available = true;

    //all the in-store categories this item belongs to
    private Set<String> itemGroupIds = new HashSet<>();

    public Item addToItemGroupId(ItemGroup in){
        if (itemGroupIds == null) itemGroupIds = new HashSet<>();
        itemGroupIds.add(in.getName());
        return this;
    }
}
