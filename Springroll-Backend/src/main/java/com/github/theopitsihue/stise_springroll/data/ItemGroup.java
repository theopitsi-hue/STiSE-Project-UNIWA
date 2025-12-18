package com.github.theopitsihue.stise_springroll.data;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ItemGroup {

    @EqualsAndHashCode.Include
    @Column(name = "group_name", nullable = false)
    private String name;

    @Column(name = "sort_index")
    private int sortIndex;
}
