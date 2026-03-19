package com.github.theopitsihue.stise_springroll.utilities;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

class UtilsTest {

    @Test
    void testStripBasic() {
        String input = "Hello World!";
        String result = Utils.strip(input);
        assertEquals("hello-world", result);
    }

    @Test
    void testStripMultipleSpacesAndSymbols() {
        String input = "  This & That! @# ";
        String result = Utils.strip(input);
        assertEquals("this-that", result);
    }

    @Test
    void testStripAlreadySlug() {
        String input = "already-slug";
        String result = Utils.strip(input);
        assertEquals("already-slug", result);
    }

    @Test
    void testStripEmptyOrNonAlpha() {
        assertEquals("", Utils.strip(""));
        assertEquals("", Utils.strip("!!!###"));
        assertEquals("123", Utils.strip("123"));
    }

    @Test
    void testGenerateUniqueSlugNoConflict() {
        Function<String, Boolean> repoCheck = s -> false; // slug does not exist
        String slug = Utils.generateUniqueSlug("My Store", repoCheck);
        assertEquals("my-store", slug);
    }

    @Test
    void testGenerateUniqueSlugWithConflict() {
        Set<String> existingSlugs = new HashSet<>();
        existingSlugs.add("my-store");
        existingSlugs.add("my-store-1");

        Function<String, Boolean> repoCheck = existingSlugs::contains;

        String slug = Utils.generateUniqueSlug("My Store", repoCheck);
        assertEquals("my-store-2", slug); // should increment until unique
    }

    @Test
    void testGenerateUniqueSlugWithSpecialChars() {
        Function<String, Boolean> repoCheck = s -> false;
        String slug = Utils.generateUniqueSlug("My & Cool Store!!", repoCheck);
        assertEquals("my-cool-store", slug);
    }
}