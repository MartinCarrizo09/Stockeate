package ar.edu.utnfrc.inventario.pruebas;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.io.InputStream;

/**
 * Clase base para pruebas de API: configura RestAssured contra el puerto aleatorio.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseIT {

    @LocalServerPort
    int puerto;

    @Autowired
    protected ObjectMapper objectMapper;

    @BeforeEach
    void configurarRestAssured() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = puerto;
    }

    protected <T> T leerJsonRecurso(String ruta, Class<T> tipo) throws Exception {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(ruta)) {
            return objectMapper.readValue(is, tipo);
        }
    }
}

