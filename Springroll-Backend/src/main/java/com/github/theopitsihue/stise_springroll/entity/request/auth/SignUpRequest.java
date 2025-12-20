package com.github.theopitsihue.stise_springroll.entity.request.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SignUpRequest {
    String username;
    String email;
    String password;
}
