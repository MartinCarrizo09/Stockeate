package ar.edu.utnfrc.inventario.servicio;

import ar.edu.utnfrc.inventario.dominio.Producto;
import ar.edu.utnfrc.inventario.repositorio.ProductoRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoServicio {

    private final ProductoRepositorio repo;

    public ProductoServicio(ProductoRepositorio repo) {
        this.repo = repo;
    }

    @Transactional
    public Producto crear(Producto p) {
        return repo.save(p);
    }

    public Producto obtenerPorId(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<Producto> listar() {
        return repo.findAll();
    }

    @Transactional
    public Producto actualizar(Long id, Producto p) {
        return repo.findById(id)
                .map(actual -> {
                    actual.setNombre(p.getNombre());
                    actual.setPrecio(p.getPrecio());
                    actual.setStock(p.getStock());
                    return repo.save(actual);
                }).orElse(null);
    }

    @Transactional
    public boolean eliminar(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }
}

