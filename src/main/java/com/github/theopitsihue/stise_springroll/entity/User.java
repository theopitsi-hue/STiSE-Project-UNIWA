package com.github.theopitsihue.stise_springroll.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id //defines this field as the primary key
    private Long id;
    private String username;
    private String password;
    private String emailID;
}
