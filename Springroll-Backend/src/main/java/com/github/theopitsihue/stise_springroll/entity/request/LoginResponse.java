package com.github.theopitsihue.stise_springroll.entity.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter@AllArgsConstructor
public class LoginResponse {
    boolean success;
    String username;
    int role;
}
