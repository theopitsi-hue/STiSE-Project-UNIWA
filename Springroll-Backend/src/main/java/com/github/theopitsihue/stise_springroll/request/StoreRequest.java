package com.github.theopitsihue.stise_springroll.request;

import lombok.Data;
import java.util.List;

@Data
public class StoreRequest {
    private String name;
    private String description;
    private Integer minOrder;
    private Integer deliveryTime;
    private String ownerEmail;
    private List<Long> categories;
}
