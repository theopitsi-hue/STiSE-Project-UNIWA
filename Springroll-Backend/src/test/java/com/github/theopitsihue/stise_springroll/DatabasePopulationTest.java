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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
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
//        User user = User.builder().email("test@gmail.com").username("testboy").password("123123123").privilege(User.Role.CLIENT).build();
//        User user1 = User.builder().email("mpampoulina@gmail.com").username("kokobina").password("kaloskodikos").privilege(User.Role.ADMIN).build();
//        User papa = User.builder().email("papa-mama-mia@gmail.com").username("papaoutai").password("paparpg").privilege(User.Role.SHOP_OWNER).build();
//
//        Random rand = new Random();
//
//        Category pizza = Category.builder().name("Pizza").build();
//        Category milkshakes = Category.builder().name("Milkshakes").build();
//        Category yogurt = Category.builder().name("Yogurt").build();
//        Category sushi = Category.builder().name("Sushi").build();
//
//        List<Category> categories = List.of(pizza,milkshakes,yogurt,sushi);
//
//        ItemGroup groupPopular = new ItemGroup("Popular", 10);
//        ItemGroup groupPizza = new ItemGroup("Pizza", 3);
//        ItemGroup groupMilkshakes = new ItemGroup("Milkshakes", 0);
//        ItemGroup groupBurgers = new ItemGroup("Burgers", 3);
//        ItemGroup groupBao = new ItemGroup("Bao Buns", 2);
//        ItemGroup groupSashimi = new ItemGroup("Sashimi", 1);
//        ItemGroup groupRolls = new ItemGroup("Rolls", 3);
//        ItemGroup groupDeals = new ItemGroup("Deals", 9);
//        ItemGroup groupYogurt = new ItemGroup("Yogurt", 0);
//        ItemGroup groupSides = new ItemGroup("Sides", 2);
//        ItemGroup groupDrinks = new ItemGroup("Drinks", 0);
//        ItemGroup groupDesserts = new ItemGroup("Desserts", 0);
//        ItemGroup groupSpecials = new ItemGroup("Specials", 8);
//
//        Set<ItemGroup> groups = Set.of(
//                groupPopular,groupPizza,groupMilkshakes,groupBurgers,groupBao,groupSashimi,groupRolls,groupDeals,groupYogurt,groupSides,groupDrinks,groupDesserts,groupSpecials
//        );
//
//        Store s1 = Store.builder().name("Pizza Fan").deliveryTime(10 + rand.nextInt(41)).build();
//        Store s2 = Store.builder().name("Chilly Box").deliveryTime(10 + rand.nextInt(41)).build();
//        Store s3 = Store.builder().name("Shisan Sushi Bar").deliveryTime(10 + rand.nextInt(41)).build();
//
//        List<Store> stores = List.of(s1, s2, s3);
//
//        s1.setItems(List.of(
//                Item.builder().name("Margherita").description("Κλασική μαργαρίτα με σάλτσα ντομάτας & μοτσαρέλα").price(BigDecimal.valueOf(8)).store(s1).build().addToItemGroupId(groupPizza),
//                Item.builder().name("Pepperoni").description("Με πεπερόνι, σάλτσα ντομάτας & μοτσαρέλα").price(BigDecimal.valueOf(9)).store(s1).build().addToItemGroupId(groupPizza),
//                Item.builder().name("BBQ Chicken").description("Κοτόπουλο, σάλτσα BBQ & τυρί μοτσαρέλα").price(BigDecimal.valueOf(10)).store(s1).build().addToItemGroupId(groupPizza),
//                Item.builder().name("Hawaiian").description("Ζαμπόν και ανανάς με μοτσαρέλα").price(BigDecimal.valueOf(9.5)).store(s1).build().addToItemGroupId(groupPizza),
//                Item.builder().name("Veggie").description("Λαχανικά εποχής με σάλτσα ντομάτας & μοτσαρέλα").price(BigDecimal.valueOf(8.5)).store(s1).build().addToItemGroupId(groupPizza),
//
//                Item.builder().name("Fries").description("Τραγανές τηγανητές πατάτες").price(BigDecimal.valueOf(2.5)).store(s1).build().addToItemGroupId(groupSides),
//                Item.builder().name("Garlic Bread").description("Φρέσκο ψωμί με σκόρδο & βούτυρο").price(BigDecimal.valueOf(3)).store(s1).build().addToItemGroupId(groupSides),
//
//                Item.builder().name("Cola").description("Αναψυκτικό τύπου κόλα").price(BigDecimal.valueOf(2)).store(s1).build().addToItemGroupId(groupDrinks),
//                Item.builder().name("Iced Tea").description("Κρύο τσάι με λεμόνι").price(BigDecimal.valueOf(2.3)).store(s1).build().addToItemGroupId(groupDrinks)
//        ));
//
//        s2.setItems(List.of(
//                Item.builder().name("Vanilla Shake").description("Μιλκσέικ βανίλιας").price(BigDecimal.valueOf(3.5)).store(s2).build().addToItemGroupId(groupMilkshakes),
//                Item.builder().name("Chocolate Shake").description("Μιλκσέικ σοκολάτας").price(BigDecimal.valueOf(3.8)).store(s2).build().addToItemGroupId(groupMilkshakes),
//                Item.builder().name("Strawberry Shake").description("Μιλκσέικ φράουλας").price(BigDecimal.valueOf(3.6)).store(s2).build().addToItemGroupId(groupMilkshakes),
//                Item.builder().name("Oreo Shake").description("Μιλκσέικ με μπισκότα Oreo").price(BigDecimal.valueOf(4)).store(s2).build().addToItemGroupId(groupMilkshakes),
//                Item.builder().name("Banana Shake").description("Μιλκσέικ μπανάνας").price(BigDecimal.valueOf(3.7)).store(s2).build().addToItemGroupId(groupMilkshakes),
//
//                Item.builder().name("Greek Yogurt").description("Παραδοσιακό ελληνικό γιαούρτι").price(BigDecimal.valueOf(4)).store(s2).build().addToItemGroupId(groupYogurt),
//                Item.builder().name("Honey Yogurt").description("Γιαούρτι με μέλι").price(BigDecimal.valueOf(4.3)).store(s2).build().addToItemGroupId(groupYogurt),
//                Item.builder().name("Berry Yogurt").description("Γιαούρτι με μούρα").price(BigDecimal.valueOf(4.5)).store(s2).build().addToItemGroupId(groupYogurt),
//                Item.builder().name("Vanilla Yogurt").description("Γιαούρτι με βανίλια").price(BigDecimal.valueOf(4.1)).store(s2).build().addToItemGroupId(groupYogurt),
//                Item.builder().name("Protein Yogurt").description("Γιαούρτι με πρωτεΐνη").price(BigDecimal.valueOf(5)).store(s2).build().addToItemGroupId(groupYogurt)
//        ));
//
//        s3.setItems(List.of(
//                Item.builder().name("Maki roll salmon").description("6 Τεμάχια. Σολομός με light wasabi sauce").price(BigDecimal.valueOf(5.50)).store(s3).build().addToItemGroupId(groupRolls),
//                Item.builder().name("Maki roll tuna").description("6 Τεμάχια. Τόνος με light wasabi sauce").price(BigDecimal.valueOf(5.90)).store(s3).build().addToItemGroupId(groupRolls),
//                Item.builder().name("Shisan roll Hawaii").description("8 Τεμάχια. Με αγγούρι, αβοκάντο & καρότο").price(BigDecimal.valueOf(4.50)).store(s3).build().addToItemGroupId(groupRolls),
//                Item.builder().name("Shisan roll volcano").description("8 Τεμάχια. Τηγανητή γαρίδα με spicy mayo sauce & αυγά χελιδονόψαρου").price(BigDecimal.valueOf(6.90)).store(s3).build().addToItemGroupId(groupRolls),
//
//                Item.builder().name("Shrimps bao bun").description("Με γαρίδα, αγγούρι, καρότο, ginger, μαγιονέζα, κρεμμύδι τηγανητό & σχοινόπρασο").price(BigDecimal.valueOf(3.90)).store(s3).build().addToItemGroupId(groupBao),
//                Item.builder().name("Smoked tofu bao bun").description("Με tofu καπνιστό, αγγούρι, καρότο, ginger, μαγιονέζα & σχοινόπρασο").price(BigDecimal.valueOf(3.90)).store(s3).build().addToItemGroupId(groupBao),
//
//                Item.builder().name("Sashimi salmon").description("3 Τεμάχια. Τρυφερά φιλετάκια σολομού").price(BigDecimal.valueOf(6.90)).store(s3).build().addToItemGroupId(groupSashimi),
//                Item.builder().name("Sashimi tuna").description("3 Τεμάχια. Τρυφερά φιλετάκια τόνου").price(BigDecimal.valueOf(7.50)).store(s3).build().addToItemGroupId(groupSashimi),
//                Item.builder().name("Sashimi seabass").description("3 Τεμάχια. Τρυφερά φιλετάκια από λαβράκι").price(BigDecimal.valueOf(6.90)).store(s3).build().addToItemGroupId(groupSashimi)
//        ));
//
//        s1.setCategories(Set.of(pizza));
//        s2.setCategories(Set.of(milkshakes));
//        s2.setCategories(Set.of(yogurt));
//        s3.setCategories(Set.of(sushi));
//
//
//        storeService.deleteAll();
//        categoryService.deleteAll();
//        userService.deleteAll();
//
//        for (Category c : categories){
//            categoryService.createCategory(c);
//        }
//
//        userService.createUser(user);
//        userService.createUser(user1);
//        userService.createUser(papa);
//
//        for (Store s : stores) {
//            s.setOwners(Set.of(papa));
//            s.setItemGroups(groups);
//            storeService.createStore(s);
//        }
    }
}