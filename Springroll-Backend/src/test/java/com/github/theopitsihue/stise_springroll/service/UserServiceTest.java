package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.User.Role;
import com.github.theopitsihue.stise_springroll.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = User.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .email("test@example.com")
                .password("secret")
                .privilege(Role.CLIENT)
                .build();
    }

    @Test
    void testGetAllUsers() {
        Page<User> page = new PageImpl<>(List.of(user));
        when(userRepo.findAll(PageRequest.of(0, 10, Sort.by("id")))).thenReturn(page);

        Page<User> result = userService.getAllUsers(0, 10);

        assertThat(result.getContent()).contains(user);
        verify(userRepo, times(1)).findAll(PageRequest.of(0, 10, Sort.by("id")));
    }

    @Test
    void testGetUserFound() {
        when(userRepo.findById(user.getId())).thenReturn(Optional.of(user));

        User result = userService.getUser(user.getId());

        assertThat(result).isEqualTo(user);
        verify(userRepo).findById(user.getId());
    }

    @Test
    void testGetUserNotFound() {
        UUID id = UUID.randomUUID();
        when(userRepo.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUser(id));
        verify(userRepo).findById(id);
    }

    @Test
    void testCreateUser() {
        when(userRepo.save(user)).thenReturn(user);

        User result = userService.createUser(user);

        assertThat(result).isEqualTo(user);
        verify(userRepo).save(user);
    }

    @Test
    void testDeleteUser() {
        UUID id = user.getId();
        doNothing().when(userRepo).deleteById(id);

        userService.deleteUser(id);

        verify(userRepo).deleteById(id);
    }
}
