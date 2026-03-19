package com.github.theopitsihue.stise_springroll.integration;

import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.User.Role;
import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import com.github.theopitsihue.stise_springroll.entity.Item;
import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.entity.order.OrderItem;
import com.github.theopitsihue.stise_springroll.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class FullShoppingFlowIntegrationTest {

    @Autowired private UserService userService;
    @Autowired private StoreService storeService;
    @Autowired private ItemService itemService;
    @Autowired private CartService cartService;
    @Autowired private OrderService orderService;

    private User testUser;
    private Store testStore;
    private Item testItem1;
    private Item testItem2;
    private UserAddress testAddress;

    @BeforeEach
    void setup() {
        // Create user
        testUser = User.builder()
                .username("client1")
                .email("client1@example.com")
                .password("password")
                .privilege(Role.CLIENT)
                .build();
        testUser = userService.createUser(testUser);

        // Add address
        testAddress = new UserAddress();
        testAddress.setAddress("123 sesame street");
        testAddress.setUser(testUser);
        testUser.addAddress(testAddress);
        testUser = userService.createUser(testUser);

        // Create store
        testStore = Store.builder()
                .name("Pizza Palace")
                .forceClosed(false)
                .build();
        testStore = storeService.createStore(testStore);

        // Create items
        testItem1 = Item.builder()
                .name("Pepperoni Pizza")
                .price(BigDecimal.valueOf(15))
                .available(true)
                .store(testStore)
                .build();
        testItem1 = itemService.createItem(testItem1);

        testItem2 = Item.builder()
                .name("Veggie Pizza")
                .price(BigDecimal.valueOf(12))
                .available(true)
                .store(testStore)
                .build();
        testItem2 = itemService.createItem(testItem2);
    }

    @Test
    void testFullShoppingFlow() {
        Cart cart = cartService.getOrCreate(testUser, testStore);
        assertNotNull(cart.getId());
        assertEquals(testUser, cart.getUser());
        assertEquals(testStore, cart.getStore());

        cart.addItem(testItem1, 2); //2 x 15 = 30
        cart.addItem(testItem2, 1); //1 x 12 = 12
        cartService.save(cart);

        Cart fetchedCart = cartService.getByID(cart.getId());
        assertEquals(2, fetchedCart.getItems().size());

        BigDecimal expectedTotal = BigDecimal.valueOf(42); //30 + 12
        assertEquals(0, expectedTotal.compareTo(fetchedCart.getFinalPrice()));

        fetchedCart.updateItem(testItem1, -1); //now 1 x 15 + 1 x 12 = 27
        cartService.save(fetchedCart);
        Cart updatedCart = cartService.getByID(fetchedCart.getId());
        assertEquals(BigDecimal.valueOf(27), updatedCart.getFinalPrice());

        Order order = orderService.create(Order.createFromCart(updatedCart, testAddress));
        assertNotNull(order.getId());
        assertEquals(testUser, order.getUser());
        assertEquals(2, order.getItems().size());

        int totalQty = order.getItems().stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();
        assertEquals(2, totalQty); //1 + 1 from cart

        updatedCart.clear();
        cartService.save(updatedCart);
        Cart clearedCart = cartService.getByID(updatedCart.getId());
        assertTrue(clearedCart.getItems().isEmpty());
    }
}