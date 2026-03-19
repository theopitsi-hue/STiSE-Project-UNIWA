package com.github.theopitsihue.stise_springroll.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(nullable = false,unique = true)
    private String slug;

    private Integer sortIndex;  // for sorting

    private String iconName; //forl ucide icons
}
