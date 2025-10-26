package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserResource { //to api mas, gia na mporei na sindethei kai na parei plirofories to front-end
    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    //DEBUG
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers(0, 100).getContent();
    }



    @GetMapping("/{id}") //ex. springroll/users/ABCD -> test user profile
    public User getUser(@PathVariable UUID id) {
        return userService.getUser(id);
    }

}
