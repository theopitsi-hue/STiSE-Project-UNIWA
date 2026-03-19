package com.github.theopitsihue.stise_springroll.entity.order;

import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "dbl_orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL
    )
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "address_id")
    private UserAddress address;

    private BigDecimal totalPrice;

    private LocalDateTime createdAt;
    private LocalDateTime lastUpdateStatusAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;



    public static @NotNull Order createFromCart(Cart cart, UserAddress address) {
        Order order = Order.builder().user(cart.getUser()).status(OrderStatus.PENDING).store(cart.getStore()).build();
        cart.getItems().forEach(item ->{
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .item(item.getItem())
                    .quantity(item.getQuantity())
                    .priceAtOrder(item.getItem().getPrice())
                    .itemNameAtOrder(item.getItem().getName())
                    .build();

            if (order.getItems() == null) order.setItems(new ArrayList<>());

            order.getItems().add(orderItem);
        });
        order.totalPrice = cart.getFinalPrice();
        order.setCreatedAt(LocalDateTime.now());
        order.address = address;
        order.setStatus(OrderStatus.COMPLETED);
        return order;
    }

    public void setStatus(OrderStatus status){
        if (status != this.status){
            this.status = status;
            this.lastUpdateStatusAt = LocalDateTime.now();
        }
    }
}
