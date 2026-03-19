package com.github.theopitsihue.stise_springroll.service;

import com.github.theopitsihue.stise_springroll.entity.Category;
import com.github.theopitsihue.stise_springroll.repository.CategoryRepository;
import com.github.theopitsihue.stise_springroll.utilities.Utils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryServiceTest {

    private CategoryRepository catRepo;
    private CategoryService categoryService;

    @BeforeEach
    void setup() {
        catRepo = mock(CategoryRepository.class);
        categoryService = new CategoryService(catRepo);
    }

    @Test
    void testGetAllCategories() {
        Category c1 = new Category();
        c1.setName("A");
        Category c2 = new Category();
        c2.setName("B");
        Page<Category> page = new PageImpl<>(List.of(c1, c2));

        when(catRepo.findAll(PageRequest.of(0, 2, Sort.by("name")))).thenReturn(page);

        Page<Category> result = categoryService.getAllCategories(0, 2);
        assertEquals(2, result.getContent().size());
        verify(catRepo).findAll(PageRequest.of(0, 2, Sort.by("name")));
    }

    @Test
    void testCategoryExists() {
        when(catRepo.findById(1L)).thenReturn(Optional.of(new Category()));
        when(catRepo.findById(2L)).thenReturn(Optional.empty());

        assertTrue(categoryService.categoryExists(1L));
        assertFalse(categoryService.categoryExists(2L));
    }

    @Test
    void testGetCategoryByIDFound() {
        Category cat = new Category();
        when(catRepo.findById(1L)).thenReturn(Optional.of(cat));

        Category result = categoryService.getCategoryByID(1L);
        assertEquals(cat, result);
    }

    @Test
    void testGetCategoryByIDNotFound() {
        when(catRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> categoryService.getCategoryByID(1L));
        assertTrue(ex.getMessage().contains("Category with id: 1 not found"));
    }

    @Test
    void testCreateCategory() {
        Category cat = new Category();
        cat.setName("Test Category");

        // Mock the static Utils.generateUniqueSlug
        try (MockedStatic<Utils> utilities = mockStatic(Utils.class)) {
            utilities.when(() -> Utils.generateUniqueSlug(eq("Test Category"), any())).thenReturn("test-category");

            when(catRepo.save(any(Category.class))).thenAnswer(i -> i.getArgument(0));

            Category result = categoryService.createCategory(cat);

            assertEquals("test-category", result.getSlug());
            verify(catRepo).save(cat);
        }
    }

    @Test
    void testDeleteCategoryByID() {
        categoryService.deleteCategoryByID(1L);
        verify(catRepo).deleteById(1L);
    }

    @Test
    void testDeleteAll() {
        categoryService.deleteAll();
        verify(catRepo).deleteAll();
    }

    @Test
    void testGetCategoriesByIds() {
        Category c1 = new Category();
        c1.setName("C1");
        Category c2 = new Category();
        c2.setName("C2");

        when(catRepo.findById(1L)).thenReturn(Optional.of(c1));
        when(catRepo.findById(2L)).thenReturn(Optional.of(c2));
        when(catRepo.findById(3L)).thenReturn(Optional.empty());

        Set<Category> result = categoryService.getCategoriesByIds(List.of(1L, 2L, 3L));
        assertEquals(2, result.size());
        assertTrue(result.contains(c1));
        assertTrue(result.contains(c2));
    }

    @Test
    void testSave() {
        Category cat = new Category();
        when(catRepo.save(cat)).thenReturn(cat);

        Category result = categoryService.save(cat);
        assertEquals(cat, result);
        verify(catRepo).save(cat);
    }

    @Test
    void testExistsByName() {
        when(catRepo.existsByName("Food")).thenReturn(true);
        when(catRepo.existsByName("Drinks")).thenReturn(false);

        assertTrue(categoryService.existsByName("Food"));
        assertFalse(categoryService.existsByName("Drinks"));
    }
}
