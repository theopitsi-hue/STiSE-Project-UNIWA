package com.github.theopitsihue.stise_springroll.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        name = "dbl_category",
        uniqueConstraints = @UniqueConstraint(
                name = "unique_values",
                columnNames = "name"
        )
)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false,unique = true) //human readable url name!!! wooo!
    private String slug;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private Set<Store> stores = new HashSet<>();

}
