package ar.edu.utnfrc.inventario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación mínima para exponer el API objetivo bajo prueba.
 * Estilo simple, adecuado a nivel jr con buenas prácticas básicas.
 */
@SpringBootApplication
public class AplicacionInventario {
    public static void main(String[] args) {
        SpringApplication.run(AplicacionInventario.class, args);
    }
}

