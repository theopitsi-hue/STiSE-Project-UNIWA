package com.github.theopitsihue.stise_springroll.entity.request.address;

import lombok.Getter;

@Getter
public class UserAddressResponse {
    private Long id;
    private String address;

    public UserAddressResponse(Long id, String address) {
        this.id = id;
        this.address = address;
    }

}
