package com.github.theopitsihue.stise_springroll.repository;

import com.github.theopitsihue.stise_springroll.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    public void saveUser() {
        User user = User.builder().emailAddress("test@gmail.com").username("testboy").password("123123123").build();
        User user1 = User.builder().emailAddress("mpampoulina@gmail.com").username("kokobina").password("kaloskodikos").build();

        ArrayList<User> users = new ArrayList<>();
        users.add(user);
        users.add(user1);

        userRepository.deleteAll();
        userRepository.saveAll(users);
    }
    @Test
    public void printAllUsers(){
        List<User> userList = userRepository.findAll();
        System.out.println("userlist = "+userList);
    }
}