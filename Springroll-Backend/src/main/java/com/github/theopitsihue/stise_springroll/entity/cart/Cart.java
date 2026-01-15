package com.github.theopitsihue.stise_springroll.entity.cart;

import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        name = "dbl_cart"
)
//represents a mutable state where the user can add/remove items, then pay for and turn into an Order
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @OneToMany(
            mappedBy = "cart",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CartItem> items = new ArrayList<>();

    private LocalDateTime updatedAt;


    public void addItem(Item item, int quantity) {
        if (items == null) items = new ArrayList<>();

        items.stream()
                .filter(ci -> ci.getItem().equals(item))
                .findFirst()
                .ifPresentOrElse(
                        ci -> ci.setQuantity(ci.getQuantity() + quantity),
                        () -> items.add(CartItem.builder().cart(this).item(item).quantity(quantity).build())
                );
    }

    public void updateItem(Item item, int qChange) {
        if (items == null) items = new ArrayList<>();

        items.removeIf(ci -> {
            if (ci.getItem().equals(item)) {
                int fin = ci.getQuantity() + qChange;

                if (fin <= 0) {
                    return true;
                }
                ci.setQuantity(fin);
            }
            return false;
        });
    }

    public void clear() {
        items.clear();
    }

    public BigDecimal getFinalPrice(){
        BigDecimal fin = BigDecimal.valueOf(0);
        for (CartItem item : items){
            fin = fin.add(item.getItem().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        return fin;
    }

    public int combinedTotalItems(){
        int fin = 0;
        for (CartItem item : items){
            fin += item.getQuantity();
        }
        return fin;
    }
}
