package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.request.auth.AuthData;
import com.github.theopitsihue.stise_springroll.entity.request.auth.SignUpRequest;
import com.github.theopitsihue.stise_springroll.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class UserService { //business logic
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    //Dependency injection
    public UserService(UserRepository userRepo, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepo = userRepo;
        passwordEncoder = bCryptPasswordEncoder;
    }

    public Page<User> getAllUsers(int page, int size){
        return userRepo.findAll(PageRequest.of(page,size, Sort.by("id")));
    }

    public boolean userExists(UUID id){
        return userRepo.findById(id).isPresent();
    }

    public User getUser(UUID id){
        return userRepo.findById(id).orElseThrow(()->new RuntimeException("User with id: "+id+" not found."));
    }

    public User createUser(User user){
        user.setPassHash(passwordEncoder.encode(user.getPassword()));
        if (user.getPrivilege() == null) user.setPrivilege(User.Role.CLIENT);
        return userRepo.save(user);
    }

    public  void deleteUser(UUID id){
        userRepo.deleteById(id);
    }

    public void deleteAll() {
        userRepo.deleteAll();
    }

    /// Attempts to authenticate a user based on credentials already in the database.
    /// Used for Sign-In
    public AuthData authenticateUser(String username, String password){
        var opt = userRepo.findByEmail(username);

        if (opt.isPresent()){
            var user = opt.get();

            if (!user.getEmail().equals(username)){
                throw new UsernameNotFoundException("Email not found in database");
            }

            if (!passwordEncoder.matches(password, user.getPassHash())){
                throw new BadCredentialsException("Password is incorrect");
            }

            return new AuthData(user.getUsername(),true, user.getPrivilege().ordinal());
        }

        return new AuthData(null, false, 0);
    }

    public boolean signUpUser(SignUpRequest request){
        if (userRepo.findByEmail(request.getEmail()).isPresent() || userRepo.findByUsername(request.getUsername()).isPresent()){
            return false;
        }

        User user=new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setPrivilege(User.Role.CLIENT);
        createUser(user);
        return true;
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}
