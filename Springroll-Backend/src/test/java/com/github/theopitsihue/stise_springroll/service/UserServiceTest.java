package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.entity.address.UserAddress;
import com.github.theopitsihue.stise_springroll.entity.cart.Cart;
import com.github.theopitsihue.stise_springroll.entity.order.Order;
import com.github.theopitsihue.stise_springroll.entity.order.OrderStatus;
import com.github.theopitsihue.stise_springroll.repository.AddressRepository;
import com.github.theopitsihue.stise_springroll.repository.CartRepository;
import com.github.theopitsihue.stise_springroll.repository.OrderRepository;
import com.github.theopitsihue.stise_springroll.repository.UserRepository;
import com.github.theopitsihue.stise_springroll.request.address.UserAddressResponse;
import com.github.theopitsihue.stise_springroll.request.auth.SignUpRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnAllUsers() {
        Page<User> page = mock(Page.class);
        when(userRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<User> result = userService.getAllUsers(0, 10);

        assertEquals(page, result);
        verify(userRepository).findAll(any(PageRequest.class));
    }

    @Test
    void shouldReturnTrueIfUserExists() {
        UUID id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.of(new User()));

        assertTrue(userService.userExists(id));
    }

    @Test
    void shouldReturnUserById() {
        UUID id = UUID.randomUUID();
        User user = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        User result = userService.getUser(id);

        assertEquals(user, result);
    }

    @Test
    void shouldThrowIfUserNotFound() {
        UUID id = UUID.randomUUID();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUser(id));
    }

    @Test
    void shouldCreateUserWithEncodedPassword() {
        User user = new User();
        user.setPassword("plain");
        when(passwordEncoder.encode("plain")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.createUser(user);

        assertEquals("encoded", result.getPassHash());
        assertEquals(User.Role.CLIENT, result.getPrivilege());
        verify(userRepository).save(user);
    }

    @Test
    void shouldDeleteUserById() {
        UUID id = UUID.randomUUID();

        userService.deleteUser(id);

        verify(userRepository).deleteById(id);
    }

    @Test
    void shouldDeleteAllUsers() {
        userService.deleteAll();

        verify(userRepository).deleteAll();
    }

    @Test
    void shouldAuthenticateUserSuccessfully() {
        User user = new User();
        user.setEmail("test@test.com");
        user.setPassHash("encoded");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plain", "encoded")).thenReturn(true);

        var auth = userService.authenticateUser("test@test.com", "plain");

        assertEquals(user.getUsername(), auth.getUsername());
    }

    @Test
    void shouldFailAuthenticationWithWrongPassword() {
        User user = new User();
        user.setEmail("test@test.com");
        user.setPassHash("encoded");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {
            userService.authenticateUser("test@test.com", "wrong");
        });
    }

    @Test
    void shouldSignUpUserSuccessfully() {
        SignUpRequest request = new SignUpRequest();
        request.setEmail("a@b.com");
        request.setUsername("user1");
        request.setPassword("pass");

        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("user1")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertTrue(userService.signUpUser(request));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldReturnFalseIfUserAlreadyExistsOnSignUp() {
        SignUpRequest request = new SignUpRequest();
        request.setEmail("a@b.com");
        request.setUsername("user1");

        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(new User()));

        assertFalse(userService.signUpUser(request));
    }

    @Test
    void shouldAddAddressToUser() {
        User user = new User();
        user.setId(UUID.randomUUID());

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserAddressResponse response = userService.addAddress(user, "123 Street");

        assertEquals("123 Street", response.getAddress());
        assertEquals(1, user.getAddresses().size());
    }

    @Test
    void shouldRemoveAddressByIdSuccessfully() {
        UUID userId = UUID.randomUUID();
        UserAddress address = new UserAddress("abc");
        address.setId(1L);

        when(addressRepository.findByIdAndUser_Id(1L, userId)).thenReturn(Optional.of(address));

        boolean result = userService.removeAddressById(userId, 1L);

        assertTrue(result);
        verify(addressRepository).delete(address);
    }

    @Test
    void shouldReturnFalseWhenRemovingAddressByIdNotFound() {
        UUID userId = UUID.randomUUID();

        when(addressRepository.findByIdAndUser_Id(1L, userId)).thenReturn(Optional.empty());

        assertFalse(userService.removeAddressById(userId, 1L));
    }
}
