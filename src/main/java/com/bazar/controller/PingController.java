package com.bazar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//Tarea programada para solicitudes periódicas
@RestController
@RequestMapping("/api")
public class PingController {
	
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Keep-alive exitoso");
    }

}
