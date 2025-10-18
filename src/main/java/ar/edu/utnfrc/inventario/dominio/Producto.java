package ar.edu.utnfrc.inventario.dominio;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad de dominio simple: Producto.
 * Validaciones con Bean Validation para reglas básicas.
 */
@Entity
@Table(name = "productos")
public class Producto {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 120, message = "El nombre no debe superar 120 caracteres")
    private String nombre;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser positivo")
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private LocalDateTime creadoEn = LocalDateTime.now();

    public Producto() { }

    public Producto(String nombre, BigDecimal precio, Integer stock) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }

    // Getters y setters simples (sin Lombok para que se vea explícito)
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public BigDecimal getPrecio() { return precio; }
    public Integer getStock() { return stock; }
    public LocalDateTime getCreadoEn() { return creadoEn; }

    public void setId(Long id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}

