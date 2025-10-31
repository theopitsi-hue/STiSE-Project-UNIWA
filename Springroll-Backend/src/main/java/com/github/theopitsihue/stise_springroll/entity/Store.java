package com.github.theopitsihue.stise_springroll.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.github.theopitsihue.stise_springroll.data.WeekScedule.WeekSchedule;
import com.github.theopitsihue.stise_springroll.data.WeekScedule.WeekScheduleConverter;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity //makes this class act like a database entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        name = "dbl_store"
)
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class Store {
    //This table's collumns are represented as types and parameters in code.

    @Id //defines this field as the primary key
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

    @Column(nullable = false,unique = true) //human readable url name!!! generate during creation
    private String slug;

    @ManyToMany
    @JoinTable(
            name = "store_category",
            joinColumns = @JoinColumn(name = "store_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @JsonIgnore
    private Set<Category> categories= new HashSet<>();


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
    private Set<User> owners= new HashSet<>();

    @Convert(converter = WeekScheduleConverter.class)
    @Column(name = "schedule",nullable = false)
    @JsonIgnore
    @Builder.Default
    private WeekSchedule schedule = new WeekSchedule();

    @Builder.Default
    private boolean forceClosed = false;

}
