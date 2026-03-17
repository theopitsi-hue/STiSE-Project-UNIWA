package com.github.theopitsihue.stise_springroll.request.cart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartFinalizeRequest {
   Long userAddressID; //for the selected address to be given to the backend
}