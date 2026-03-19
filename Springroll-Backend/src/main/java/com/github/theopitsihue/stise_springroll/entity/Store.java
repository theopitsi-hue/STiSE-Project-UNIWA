package com.github.theopitsihue.stise_springroll.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.github.theopitsihue.stise_springroll.data.ItemGroup;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.util.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        name = "dbl_store"
)
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(
            name="id",
            nullable = false,
            unique = true,
            updatable = false
    )
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false,unique = true) //human readable url name!!! generate during creation
    private String slug;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "store_category",
            joinColumns = @JoinColumn(name = "store_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>(); //categories for types of store (EX pizza, burgers, ect)


    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Item> items = new ArrayList<>(); // All items for sale in this store

    @ManyToMany
    @JoinTable(
            name = "store_owners",
            joinColumns = @JoinColumn(name = "store_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private Set<User> owners = new HashSet<>();

    @Builder.Default
    private boolean forceClosed = false;

    @ElementCollection
    @CollectionTable(
            name = "store_item_groups",
            joinColumns = @JoinColumn(name = "store_id")
    )
    private Set<ItemGroup> itemGroups = new HashSet<>(); //for grouping items of a store together, (all ice cream, all burgers, ect)

    private int deliveryTime = 10;
    private BigInteger minOrder = BigInteger.ZERO;

    public void setItems(List<Item> items){
        this.items = new ArrayList<>();
        int fin = 100;
        for(Item i : items){
            if (i.getPrice().intValue() < fin){
                fin = i.getPrice().intValue();
            }
        }
        minOrder = BigInteger.valueOf(fin);
        this.items.addAll(items);
    }

    public void setOwner(User user){
        this.owners.clear();
        this.owners.add(user);
    }
}
