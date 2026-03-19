package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.config.security.CustomUserDetails;
import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.request.cart.CartFinalizeRequest;
import com.github.theopitsihue.stise_springroll.request.cart.CartModificationRequest;
import com.github.theopitsihue.stise_springroll.request.cart.CartModificationResponse;
import com.github.theopitsihue.stise_springroll.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartResource {
    private final CartService cartService;
    private final UserService userService;
    private final StoreService storeService;
    private final ItemService itemService;
    private final OrderService orderService;

    public CartResource(CartService cartService, UserService userService, StoreService storeService, ItemService itemService, OrderService orderService) {
        this.cartService = cartService;
        this.userService = userService;
        this.storeService = storeService;
        this.itemService = itemService;
        this.orderService = orderService;
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getCart(
            @AuthenticationPrincipal CustomUserDetails userIn,
            @PathVariable String id
    ) {
        if (userIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }

        User user = userService.getUserByUsername(userIn.getUsername());
        Store store = storeService.getStoreByID(id);

        if (store == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No such store!"));
        }

        Cart cart = cartService.getOrCreate(user, store);

        return ResponseEntity.ok(new CartModificationResponse().fromCart(cart));
    }

    @GetMapping("/get/bs/{id}")
    public ResponseEntity<?> getCartSlug(
            @AuthenticationPrincipal CustomUserDetails userIn,
            @PathVariable String id
    ) {
        if (userIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }

        User user = userService.getUserByUsername(userIn.getUsername());
        Optional<Store> store = storeService.getStoreBySlug(id);

        if (store.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No such store!"));
        }

        Cart cart = cartService.getOrCreate(user, store.get());

        return ResponseEntity.ok(new CartModificationResponse().fromCart(cart));
    }

    @PostMapping("/mod")
    public ResponseEntity<?> modifyCart(
            @AuthenticationPrincipal CustomUserDetails userIn,
            @RequestBody CartModificationRequest req
    ) {
        if (userIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }

        User user = userService.getUserByUsername(userIn.getUsername());

        if (req.getChange() == 0 && !req.isClear()) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body(Map.of("error", "No change to cart detected."));
        }

        if (req.isClear()) {
            Store store = storeService.getStoreByID(req.getStoreId());
            Cart cart = cartService.getOrCreate(user, store);
            cart.clear();
            cartService.save(cart);
            return ResponseEntity.ok(new CartModificationResponse().fromCart(cart));
        }

        Item item = itemService.getItemByID(req.getItemId());
        Store store = item.getStore();

        if (store.isForceClosed()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Store is closed."));
        }

        if (!item.isAvailable()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Item unavailable."));
        }

        Cart cart = cartService.getOrCreate(user, store);

        if (cart.getStore() != null &&
                !cart.getStore().getId().equals(store.getId())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cart belongs to another store."));
        }

        if (req.getChange() > 0) {
            cart.addItem(item, req.getChange());
        } else {
            cart.updateItem(item, req.getChange());
        }

        cartService.save(cart);

        return ResponseEntity.ok(new CartModificationResponse().fromCart(cart));
    }

    @PostMapping("/fin/{storeId}")
    public ResponseEntity<?> finalizeCart(
            @AuthenticationPrincipal CustomUserDetails userIn,
            @PathVariable UUID storeId,
            @RequestBody CartFinalizeRequest req
    ) {
        if (userIn == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }

        User user = userService.getUserByUsername(userIn.getUsername());
        Store store = storeService.getStoreByID(storeId);

        Cart cart = cartService.getOrCreate(user, store);

        if (cart.getItems().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cart is empty."));
        }

        UserAddress addr = userService.getUserAddress(req.getUserAddressID());

        if (addr == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid address."));
        }

        Order order = orderService.create(
                Order.createFromCart(cart, addr)
        );

        return ResponseEntity.ok(Map.of("order_id", order.getId()));
    }
}
