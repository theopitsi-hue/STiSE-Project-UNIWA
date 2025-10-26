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
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
public class UserService { //business logic
    private final UserRepository userRepo;

    //Dependency injection
    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
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
        return userRepo.save(user);
    }

    public  void deleteUser(UUID id){
        userRepo.deleteById(id);
    }

}
