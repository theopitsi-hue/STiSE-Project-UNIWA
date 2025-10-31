package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
    public boolean authenticateUser(String username, String password){
        var opt = userRepo.findByUsername(username);

        if (opt.isPresent()){
            var user = opt.get();

            if (!user.getUsername().equals(username)){
                throw new UsernameNotFoundException("Username not found in database");
            }
            System.out.println("PASSWORD:"+password);
            if (!passwordEncoder.matches(password, user.getPassHash())){
                throw new BadCredentialsException("Password is incorrect");
            }

            return true;
        }

        return false;
    }
}
