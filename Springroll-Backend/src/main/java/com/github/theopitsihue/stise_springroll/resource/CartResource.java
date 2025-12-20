package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.request.cart.CartModificationRequest;
import com.github.theopitsihue.stise_springroll.entity.request.cart.CartModificationResponse;
import com.github.theopitsihue.stise_springroll.service.CartService;
import com.github.theopitsihue.stise_springroll.service.ItemService;
import com.github.theopitsihue.stise_springroll.service.StoreService;
import com.github.theopitsihue.stise_springroll.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartResource {
    private final CartService cartService;
    private final UserService userService;
    private final StoreService storeService;
    private final ItemService itemService;

    public CartResource(CartService cartService, UserService userService, StoreService storeService, ItemService itemService) {
        this.cartService = cartService;
        this.userService = userService;
        this.storeService = storeService;
        this.itemService = itemService;
    }

    @PostMapping("/mod")
    public ResponseEntity<?> modifyCart(@RequestBody CartModificationRequest req, HttpSession session) {
        String email = (String) session.getAttribute("user");

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in"));
        }

        // user is logged in
        // load User entity using email
        Optional<User> user = userService.findByEmail(email);

        if (user.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not logged in or not registered."));
        }

        if (req.getChange() == 0 && !req.isClear()){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body(Map.of("error", "No change to cart detected."));
        }

        //get or create the cart if it doesn't exist
        Cart cart = cartService.findByUser(user.get())
                .orElseGet(() -> cartService.create(Cart.builder().user(user.get()).build()));

        if (req.isClear()){
            cart.clear();
            cartService.save(cart);
            return ResponseEntity.ok(new CartModificationResponse().fromCart(cart));
        }

        Item item = null;
        try {
            System.out.println(req.getItemId());
            item = itemService.getItemByID(req.getItemId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Requested Item UUID does Not exist."));
        }

        Store store = null;
        try {
            store = item.getStore();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Requested Store UUID does Not exist."));
        }

        if (store != null && item != null){
            if (store.isForceClosed()){ //todo: add schedule closed
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Requested Store is closed."));
            }

            if (!item.isAvailable()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Requested Item is unavailable."));
            }

            if (req.getChange() > 0){
                cart.addItem(item,req.getChange());
            }else{
                cart.updateItem(item,req.getChange());
            }

            cart.setUpdatedAt(LocalDateTime.now());
        }

        //save the modified cart
        cartService.save(cart);

        return ResponseEntity.ok(new CartModificationResponse().fromCart(cart));
    }
}
