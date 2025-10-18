package ar.edu.utnfrc.inventario.pruebas;

import io.qameta.allure.*;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

/**
 * Suite de pruebas de API para /api/productos.
 * Incluye: creación, obtención, listado, actualización, borrado, contrato y errores.
 */
@Epic("Inventario & Precios")
@Feature("API de Productos")
public class ProductoIT extends BaseIT {

    record ProductoDTO(String nombre, double precio, int stock) { }

    @Test
    @Story("Crear producto válido")
    @Severity(SeverityLevel.CRITICAL)
    void debeCrearProducto_conDatosValidos_201_yContratoValido() throws Exception {
        var data = leerJsonRecurso("datos/productos-validos.json", ProductoDTO[].class);
        var primero = data[0];

        given()
          .contentType(ContentType.JSON)
          .body(primero)
        .when()
          .post("/api/productos")
        .then()
          .statusCode(201)
          .header("Location", containsString("/api/productos/"))
          .body(matchesJsonSchemaInClasspath("esquemas/producto-schema.json"))
          .body("nombre", equalTo(primero.nombre()))
          .body("precio", closeTo(primero.precio(), 0.0001))
          .body("stock", equalTo(primero.stock()));
    }

    @Test
    @Story("Obtener por id (existente)")
    void debeObtenerProducto_existente_200() {
        // Primero crear
        var id =
        given().contentType(ContentType.JSON)
               .body(new ProductoDTO("Caja Mediana", 2000.0, 5))
        .when().post("/api/productos")
        .then().statusCode(201)
               .extract().path("id");

        // Luego obtener
        given().when().get("/api/productos/{id}", id)
              .then().statusCode(200)
              .body("id", equalTo(id))
              .body("nombre", equalTo("Caja Mediana"));
    }

    @Test
    @Story("Listar productos")
    void debeListarProductos_200() {
        given().when().get("/api/productos")
              .then().statusCode(200)
              .body("size()", greaterThanOrEqualTo(0));
    }

    @Test
    @Story("Actualizar producto")
    void debeActualizarProducto_200() {
        Integer id =
        given().contentType(ContentType.JSON)
               .body(new ProductoDTO("Film", 1200.0, 8))
        .when().post("/api/productos")
        .then().statusCode(201)
               .extract().path("id");

        given().contentType(ContentType.JSON)
               .body(new ProductoDTO("Film Stretch", 1300.0, 10))
        .when().put("/api/productos/{id}", id)
        .then().statusCode(200)
               .body("nombre", equalTo("Film Stretch"))
               .body("precio", closeTo(1300.0, 0.0001))
               .body("stock", equalTo(10));
    }

    @Test
    @Story("Eliminar producto")
    void debeEliminarProducto_204() {
        Integer id =
        given().contentType(ContentType.JSON)
               .body(new ProductoDTO("Bolsa", 500.0, 30))
        .when().post("/api/productos")
        .then().statusCode(201)
               .extract().path("id");

        given().when().delete("/api/productos/{id}", id)
              .then().statusCode(204);

        given().when().get("/api/productos/{id}", id)
              .then().statusCode(404);
    }

    @Test
    @Story("Errores de validación 400")
    void debeFallarCrearProducto_conDatosInvalidos_400() throws Exception {
        var invalidos = leerJsonRecurso("datos/productos-invalidos.json", ProductoDTO[].class);

        for (var dto : invalidos) {
            given().contentType(ContentType.JSON)
                   .body(dto)
            .when().post("/api/productos")
            .then().statusCode(400)
                   .body("mensaje", equalTo("Solicitud inválida"))
                   .body("errores.size()", greaterThan(0));
        }
    }

    @Test
    @Story("404 no encontrado")
    void debeResponder404_alBuscarInexistente() {
        given().when().get("/api/productos/{id}", 999_999)
              .then().statusCode(404);
    }
}

