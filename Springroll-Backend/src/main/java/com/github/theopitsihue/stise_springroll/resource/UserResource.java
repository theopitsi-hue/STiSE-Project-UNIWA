package com.github.theopitsihue.stise_springroll.resource;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@RestController
//@RequestMapping("/users")
//@RequiredArgsConstructor
//public class UserResource {
//    private final ContactService contactService;
//
//    @PostMapping
//    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
//        //return ResponseEntity.ok().body(contactService.createContact(contact));
//        return ResponseEntity.created(URI.create("/contacts/userID")).body(contactService.createContact(contact));
//    }
//
//    @GetMapping
//    public ResponseEntity<Page<Contact>> getContacts(@RequestParam(value = "page", defaultValue = "0") int page,
//                                                     @RequestParam(value = "size", defaultValue = "10") int size) {
//        return ResponseEntity.ok().body(contactService.getAllContacts(page, size));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Contact> getContact(@PathVariable(value = "id") String id) {
//        return ResponseEntity.ok().body(contactService.getContact(id));
//    }
//
//
//
//    @GetMapping(path = "/image/{filename}", produces = { IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE })
//    public byte[] getPhoto(@PathVariable("filename") String filename) throws IOException {
//        return Files.readAllBytes(Paths.get(PHOTO_DIRECTORY + filename));
//    }
//}
