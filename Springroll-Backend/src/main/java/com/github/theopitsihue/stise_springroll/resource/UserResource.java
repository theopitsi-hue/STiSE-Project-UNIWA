package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.request.LoginRequest;
import com.github.theopitsihue.stise_springroll.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserResource { //to api mas, gia na mporei na sindethei kai na parei plirofories to front-end
    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    //DEBUG, REMOVE FOR FINAL
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers(0, 100).getContent();
    }



    @GetMapping("/{id}") //ex. springroll/users/ABCD -> test user profile
    public User getUser(@PathVariable UUID id) {
        return userService.getUser(id);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest req, HttpSession session){
        try{
            boolean isAuth = userService.authenticateUser(req.getUsername(),req.getPassword());

            if (isAuth){
                session.setAttribute("user", req.getUsername());
                return ResponseEntity.ok("Login Was successful.");
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unknown error occurred during sign up!");
        }
    }

}
