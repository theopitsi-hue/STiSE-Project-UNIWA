package com.github.theopitsihue.stise_springroll.config.security;

import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()){
            throw new UsernameNotFoundException("This user does not exist in the database");
        }

        return new CustomUserDetails(user.get());
    }
}