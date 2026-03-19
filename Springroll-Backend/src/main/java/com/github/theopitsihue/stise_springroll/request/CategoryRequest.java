package com.github.theopitsihue.stise_springroll.request;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private Integer sortIndex;
    private String iconName;
}
