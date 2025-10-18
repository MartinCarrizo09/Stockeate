package ar.edu.utnfrc.inventario.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/** Asesor global para errores de validación. */
@RestControllerAdvice
public class AsesorErrores {

    @org.springframework.web.bind.annotation.ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> onValidacion(MethodArgumentNotValidException ex) {
        Map<String, Object> cuerpo = new HashMap<>();
        cuerpo.put("mensaje", "Solicitud inválida");
        cuerpo.put("errores", ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> Map.of("campo", fe.getField(), "detalle", fe.getDefaultMessage()))
                .toList());
        return ResponseEntity.badRequest().body(cuerpo);
    }
}

