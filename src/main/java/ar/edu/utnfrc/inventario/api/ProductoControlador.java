package ar.edu.utnfrc.inventario.api;

import ar.edu.utnfrc.inventario.dominio.Producto;
import ar.edu.utnfrc.inventario.servicio.ProductoServicio;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * Controlador REST con CRUD básico. Respuestas claras para facilitar las pruebas.
 */
/**
 * @CrossOrigin se deja como respaldo para dev; es redundante
 * con la configuración global en CorsConfig.
 */
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/productos")
public class ProductoControlador {

    private final ProductoServicio servicio;

    public ProductoControlador(ProductoServicio servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Producto dto) {
        Producto creado = servicio.crear(dto);
        return ResponseEntity.created(URI.create("/api/productos/" + creado.getId()))
                .body(creado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        Producto p = servicio.obtenerPorId(id);
        return (p != null) ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public List<Producto> listar() {
        return servicio.listar();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody Producto dto) {
        Producto actualizado = servicio.actualizar(id, dto);
        return (actualizado != null) ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return servicio.eliminar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
