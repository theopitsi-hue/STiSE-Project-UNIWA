package com.github.theopitsihue.stise_springroll.entity.dto;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemGroupDTO {
    private String name;
    private int sortIndex;
}
