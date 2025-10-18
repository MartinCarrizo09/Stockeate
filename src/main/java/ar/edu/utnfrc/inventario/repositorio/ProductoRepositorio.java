package ar.edu.utnfrc.inventario.repositorio;

import ar.edu.utnfrc.inventario.dominio.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repositorio JPA básico. */
public interface ProductoRepositorio extends JpaRepository<Producto, Long> { }

