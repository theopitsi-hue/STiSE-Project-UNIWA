package com.github.theopitsihue.stise_springroll.entity.order;

import com.github.theopitsihue.stise_springroll.entity.User;
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


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "dbl_orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL
    )
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    public static @NotNull Order createFromCart(Cart cart) {
        Order order = Order.builder().user(cart.getUser()).status(OrderStatus.PENDING).build();
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
        return order;
    }

    enum OrderStatus{
        PENDING,
        COMPLETED
    }

    private BigDecimal totalPrice;

    private LocalDateTime createdAt;
}
