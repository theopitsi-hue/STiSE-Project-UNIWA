package com.github.theopitsihue.stise_springroll.entity.address;

import com.github.theopitsihue.stise_springroll.entity.User;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_addresses")
@Data
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public UserAddress() {}

    public UserAddress(String address) {
        this.address = address;
    }
}
