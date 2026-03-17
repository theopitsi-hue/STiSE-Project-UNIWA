package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.config.security.CustomUserDetails;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.entity.order.OrderDTO;
import com.github.theopitsihue.stise_springroll.entity.order.OrderMapper;
import com.github.theopitsihue.stise_springroll.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
public class OrderResource {
    private final OrderService orderService;
    private final UserService userService;

    public OrderResource(OrderService orderService,UserService service) {
        this.orderService = orderService;
        this.userService = service;
    }

    @RequestMapping("/api/orders")
    public ResponseEntity<?> getAllUserOrders(@AuthenticationPrincipal CustomUserDetails userIn, HttpSession session) {

        if (userIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }

        Optional<User> user = Optional.ofNullable(userService.getUserByUsername(userIn.getUsername()));

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User doesn't exist."));
        }

        List<Order> orders = orderService.getByUserID(user.get().getId());

        List<OrderDTO> orderDTOs = orders.stream()
                .map(OrderMapper::toDTO)
                .toList();

        return ResponseEntity.ok(orderDTOs);
    }

}
