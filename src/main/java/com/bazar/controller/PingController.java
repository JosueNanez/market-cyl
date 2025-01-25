package com.bazar.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

//Tarea programada para solicitudes periódicas
@RestController
public class PingController {
	
    @GetMapping("/api/ping")
    public String ping() {
        return "Pong! " + System.currentTimeMillis();
    }

}
