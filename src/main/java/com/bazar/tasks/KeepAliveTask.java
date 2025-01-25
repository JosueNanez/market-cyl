package com.bazar.tasks;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

//Tarea programada para solicitudes periódicas
@Component
public class KeepAliveTask {
	@Scheduled(fixedRate = 14 * 60 * 1000) // Cada 14 minutos
	public void sendKeepAliveRequest() {
		try {
			// URL de tu propia aplicación en Render
			URL url = new URL("https://market-cyl.onrender.com/api/ping");
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod("GET");
			connection.connect();

			int responseCode = connection.getResponseCode();
			if (responseCode == 200) {
				System.out.println("Keep-alive exitoso: "  + new Date());
			} else {
				System.err.println("Error en keep-alive: " + responseCode);
			}
			connection.disconnect();
		} catch (Exception e) {
			System.err.println("Error al realizar keep-alive: " + e.getMessage());
		}
	}

}
