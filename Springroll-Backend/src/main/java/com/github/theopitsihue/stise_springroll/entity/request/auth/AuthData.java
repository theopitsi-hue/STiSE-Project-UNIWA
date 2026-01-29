package com.github.theopitsihue.stise_springroll.entity.request.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthData {
    String username;
    boolean success;
    int role;

}
