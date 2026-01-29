package com.github.theopitsihue.stise_springroll.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity //makes this class act like a database entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(//makes this class a database table
        name = "dbl_user",
        uniqueConstraints = @UniqueConstraint( //creates a constraint for the specified column(s) to be unique
                name = "unique_values",        //in this case, i want to make these specific column have *unique* values.
                columnNames = "email"
        )

)
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public class User {
    //This table's collumns are represented as types and parameters in code.

    @Id //defines this field as the primary key
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(
            name="id",
            nullable = false,
            unique = true,
            updatable = false
    )
    private UUID id;



    @Column(
            name="username",
            nullable = false
    )
    private String username;

    @Column(name="password", nullable = false)
    @JsonIgnore //will hide from api get requests.
    private String password;

    private String passHash;

    @Column(//by default, the columns in mysql are named the /same/ as the field. Using this annotation overrides that.
            name="email",
            nullable = false //makes the field impossible to set to a null value.
    )
    private String email;

    @Column(
            name="privilege",
            nullable = false
    )
    private Role privilege;

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<UserAddress> addresses = new ArrayList<>();

    public void addAddress(UserAddress address) {
        addresses.add(address);
        address.setUser(this);
    }

    public boolean removeAddress(UserAddress address) {
        if (addresses.remove(address)) {
            address.setUser(null);
            return true;
        }
        return false;
    }

    public enum Role{
        CLIENT,
        SHOP_OWNER,
        ADMIN
    }
}
