package com.github.theopitsihue.stise_springroll;

import com.github.theopitsihue.stise_springroll.data.ItemGroup;
import com.github.theopitsihue.stise_springroll.entity.*;
import com.github.theopitsihue.stise_springroll.repository.UserRepository;
import com.github.theopitsihue.stise_springroll.service.CategoryService;
import com.github.theopitsihue.stise_springroll.service.StoreService;
import com.github.theopitsihue.stise_springroll.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@SpringBootTest
class DatabasePopulationTest {
    @Autowired
    private UserService userService;

    @Autowired
    private StoreService storeService;

    @Autowired
    private com.github.theopitsihue.stise_springroll.service.ItemService itemService;


    @Autowired
    private CategoryService categoryService;



    @Test
    public void saveUser() {
        User user = User.builder().email("test@gmail.com").username("testboy").password("123123123").privilege(User.Role.CLIENT).build();
        User user1 = User.builder().email("mpampoulina@gmail.com").username("kokobina").password("kaloskodikos").privilege(User.Role.ADMIN).build();
        User papa = User.builder().email("papa-mama-mia@gmail.com").username("papaoutai").password("paparpg").privilege(User.Role.SHOP_OWNER).build();

        Category pizza = Category.builder().name("Pizza").build();
        Category milkshakes = Category.builder().name("Milkshakes").build();
        Category yogurt = Category.builder().name("Yogurt").build();

        ItemGroup groupMilkshakes = new ItemGroup("milkshakes",0);

        Store one = Store.builder().name("papa's pizza").build();
        Store two = Store.builder()
                .name("papa's freezeria")
                .build();

        two.setItems(
                List.of(Item.builder().name("Vanilla Milkshake").price(3.49).store(two).build().addToItemGroupId(groupMilkshakes),
                Item.builder().name("Chocolate Milkshake").price(3.70).store(two).build().addToItemGroupId(groupMilkshakes),
                Item.builder().name("Strawberry Milkshake").price(3.49).store(two).build().addToItemGroupId(groupMilkshakes),
                Item.builder().name("Frozen Yogurt").price(5.5).store(two).build())
        );

        two.setItemGroups(Set.of(
                new ItemGroup("popular",10),
                groupMilkshakes,
                new ItemGroup("yogurt",0)
        ));

        one.setCategories(Set.of(pizza));
        two.setCategories(Set.of(yogurt,milkshakes));

        two.setOwners(Set.of(papa));


        storeService.deleteAll();
        categoryService.deleteAll();
        userService.deleteAll();


        categoryService.createCategory(yogurt);
        categoryService.createCategory(milkshakes);
        categoryService.createCategory(pizza);


        userService.createUser(user);
        userService.createUser(user1);
        userService.createUser(papa);

        storeService.createStore(one);
        storeService.createStore(two);

    }
}