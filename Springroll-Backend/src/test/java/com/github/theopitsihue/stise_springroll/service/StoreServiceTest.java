package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.Store;
import com.github.theopitsihue.stise_springroll.entity.User;
import com.github.theopitsihue.stise_springroll.repository.StoreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StoreServiceTest {

    @Mock
    private StoreRepository storeRepository;

    @InjectMocks
    private StoreService storeService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnAllStores() {
        Page<Store> page = mock(Page.class);

        when(storeRepository.findAll(any(Pageable.class)))
                .thenReturn(page);

        Page<Store> result = storeService.getAllStores(0, 10);

        assertEquals(page, result);
        verify(storeRepository).findAll(any(Pageable.class));
    }

    @Test
    void shouldReturnTrueIfStoreExists() {
        UUID id = UUID.randomUUID();
        when(storeRepository.findById(id)).thenReturn(Optional.of(new Store()));

        assertTrue(storeService.storeExists(id));
    }

    @Test
    void shouldReturnStoreByID() {
        UUID id = UUID.randomUUID();
        Store store = new Store();

        when(storeRepository.findById(id)).thenReturn(Optional.of(store));

        Store result = storeService.getStoreByID(id);

        assertEquals(store, result);
    }

    @Test
    void shouldThrowWhenStoreNotFound() {
        UUID id = UUID.randomUUID();
        when(storeRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> storeService.getStoreByID(id));
    }

    @Test
    void shouldReturnStoreBySlug() {
        Store store = new Store();
        String slug = "my-store";

        when(storeRepository.findBySlug(slug)).thenReturn(Optional.of(store));

        Store result = storeService.getStoreBySlug(slug).get();

        assertEquals(store, result);
    }


    @Test
    void shouldCreateStoreWithUniqueSlug() {
        Store store = new Store();
        store.setName("Test Store");

        when(storeRepository.existsBySlug(anyString())).thenReturn(false);
        when(storeRepository.save(any(Store.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Store result = storeService.createStore(store);

        assertNotNull(result.getSlug());
        verify(storeRepository).save(store);
    }

    @Test
    void shouldDeleteStoreByID() {
        UUID id = UUID.randomUUID();

        storeService.deleteStoreByID(id);

        verify(storeRepository).deleteById(id);
    }

    @Test
    void shouldDeleteAllStores() {
        storeService.deleteAll();

        verify(storeRepository).deleteAll();
    }

    @Test
    void adminCanEditStore() {
        User admin = new User();
        admin.setPrivilege(User.Role.ADMIN);
        Store store = new Store();

        assertTrue(storeService.canEditStore(admin, store));
    }

    @Test
    void ownerCanEditStore() {
        User owner = new User();
        owner.setPrivilege(User.Role.SHOP_OWNER);

        Store store = new Store();
        store.setOwner(owner);

        assertTrue(storeService.canEditStore(owner, store));
    }

    @Test
    void userCannotEditStore() {
        User user = new User();
        user.setPrivilege(User.Role.CLIENT);

        Store store = new Store();
        store.setOwner(null);

        assertFalse(storeService.canEditStore(user, store));
    }

    @Test
    void shouldThrowIfUnauthorizedUpdate() {
        UUID id = UUID.randomUUID();
        Store store = new Store();

        User user = new User();
        user.setPrivilege(User.Role.CLIENT);

        when(storeRepository.findById(id)).thenReturn(Optional.of(store));

        assertThrows(RuntimeException.class, () -> storeService.updateStore(id, store, user));
    }

    @Test
    void shouldUpdateStoreIfAuthorized() {
        UUID id = UUID.randomUUID();
        Store store = new Store();
        User admin = new User();
        admin.setPrivilege(User.Role.ADMIN);

        when(storeRepository.findById(id)).thenReturn(Optional.of(store));
        when(storeRepository.save(store)).thenReturn(store);

        Store result = storeService.updateStore(id, store, admin);

        assertEquals(store, result);
        verify(storeRepository).save(store);
    }
}
