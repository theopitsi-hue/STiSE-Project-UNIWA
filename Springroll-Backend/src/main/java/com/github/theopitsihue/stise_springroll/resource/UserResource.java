package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.entity.request.auth.AuthData;
import com.github.theopitsihue.stise_springroll.entity.request.auth.LoginRequest;
import com.github.theopitsihue.stise_springroll.entity.request.auth.LoginResponse;
import com.github.theopitsihue.stise_springroll.entity.request.auth.SignUpRequest;
import com.github.theopitsihue.stise_springroll.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class UserResource { //to api mas, gia na mporei na sindethei kai na parei plirofories to front-end
    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    //DEBUG, REMOVE FOR FINAL
//    @GetMapping("/all")
//    public List<User> getAllUsers() {
//        return userService.getAllUsers(0, 100).getContent();
//    }

//
//
//    @GetMapping("/{id}") //ex. springroll/users/ABCD -> test user profile
//    public User getUser(@PathVariable UUID id) {
//        return userService.getUser(id);
//    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session){
        try{
            AuthData authData = userService.authenticateUser(req.getEmail(),req.getPassword());

            if (authData.isSuccess()){
                session.setAttribute("user", req.getEmail());
                return ResponseEntity.ok(new LoginResponse(true, authData.getUsername(), authData.getRole()));
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "Unable to Authorize user.", 0));
            }
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unknown error occurred during sign up!");
        }
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody SignUpRequest req, HttpSession session){
        if (req.getPassword() == null || req.getUsername() == null || req.getEmail() == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing sign-up form details.");

        if (userService.signUpUser(req)){
            return ResponseEntity.ok(new LoginResponse(true,req.getUsername(),0));

        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User with that password/email already exists.");
        }
    }

}
