package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor //required for dependency injection
public class UserService {
//    private final UserRepository userRepo;
//
//    public Page<User> getAllUsers(int page, int size){
//        return userRepo.findAll(PageRequest.of(page,size, Sort.by("id")));
//    }
//
//    public User getUser(long id){
//        return userRepo.findById(id).orElseThrow(()->new RuntimeException("User with id: "+id+" not found."));
//    }
//
//    public User createUser(User user){
//        return userRepo.save(user);
//    }
//
//    public  void deleteUser(long id){
//        userRepo.deleteById(id);
//    }
}
