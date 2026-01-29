package com.github.theopitsihue.stise_springroll.resource;

import com.github.theopitsihue.stise_springroll.config.security.CustomUserDetails;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.request.address.UserAddressRequest;
import com.github.theopitsihue.stise_springroll.entity.request.address.UserAddressResponse;
import com.github.theopitsihue.stise_springroll.entity.request.auth.AuthData;
import com.github.theopitsihue.stise_springroll.entity.request.auth.LoginRequest;
import com.github.theopitsihue.stise_springroll.entity.request.auth.LoginResponse;
import com.github.theopitsihue.stise_springroll.entity.request.auth.SignUpRequest;
import com.github.theopitsihue.stise_springroll.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest request) {
        try {
            AuthData authData = userService.authenticateUser(req.getEmail(), req.getPassword());

            if (!authData.isSuccess()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Unable to Authorize user.", 0));
            }

            // Load the full user entity
            Optional<User> user = userService.findByEmail(req.getEmail());

            if (user.isPresent()) {
                // Wrap it in your CustomUserDetails
                CustomUserDetails userDetails = new CustomUserDetails(user.get());

                // Create Spring Security authentication token
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );

                // Set the authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);

                // Persist in session
                request.getSession(true).setAttribute(
                        HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                        SecurityContextHolder.getContext()
                );

                return ResponseEntity.ok(new LoginResponse(true, user.get().getUsername(), authData.getRole()));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("No such user!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unknown error occurred during login!");
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

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        //Invalidate the session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        //clear Spring Security context
        SecurityContextHolder.clearContext();

        //clear cookies for frontend
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    @GetMapping("/addr")
    public List<UserAddressResponse> getAddresses(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return userService.getAddresses(userService.getUserByUsername(user.getUsername()));
    }

    @PostMapping("/addr")
    public UserAddressResponse addAddress(
            Authentication authentication,
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody UserAddressRequest request
    ) {
        return userService.addAddress(userService.getUserByUsername(user.getUsername()), request.getAddress());
    }

    @DeleteMapping("/addr/{id}")
    public ResponseEntity<Void> removeSavedAddress(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long id
    ) {
        boolean removed = userService.removeAddressById(userService.getUserByUsername(user.getUsername()).getId(), id);

        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

}
