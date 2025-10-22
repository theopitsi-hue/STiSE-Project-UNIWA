package com.github.theopitsihue.stise_springroll.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //makes this class act like a database entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(//makes this class a database table
        name = "dbl_user",
        uniqueConstraints = @UniqueConstraint( //creates a constraint for the specified column(s) to be unique
                name = "unique_values",        //in this case, i want to make these specific column have *unique* values.
                columnNames = "email_address"
        )

)
public class User {
    //This table's collumns are represented as types and parameters in code.

    @Id //defines this field as the primary key
    @SequenceGenerator( //this will generate a sequence for every user added. ex. userA id = 0, userB id = 1, userC id = 2 and so on...
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE, //forces the database to generate a sequence for every student added.
            generator = "user_sequence" //defined above
    )
    @Column(
            name="user_id",
            nullable = false
    )
    private Long id;



    @Column(
            name="username",
            nullable = false
    )
    private String username;

    @Column(
            name="password",
            nullable = false
    )
    private String password;

    @Column(//by default, the columns in mysql are named the /same/ as the field. Using this annotation overrides that.
            name="email_address",
            nullable = false //makes the field impossible to set to a null value.
    )
    private String emailAddress;

    @Column(
            name="privilege",
            nullable = false
    )
    private Role privilege;

    public enum Role{
        CLIENT,
        SHOP_OWNER,
        ADMIN
    }
}
