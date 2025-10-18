## 📝 Descripción del cambio

<!-- Describe brevemente qué cambia este PR (máximo 2-3 líneas) -->



## 🔧 Tipo de cambio

<!-- Marca con [x] el tipo correspondiente -->

- [ ] 🐛 **Fix** - Corrección de bug
- [ ] ✨ **Feature** - Nueva funcionalidad
- [ ] 📚 **Docs** - Actualización de documentación
- [ ] 🧹 **Chore** - Tareas de mantenimiento (deps, config, etc.)

## ✅ Checklist

<!-- Marca [x] cuando hayas completado cada item -->

- [ ] **Compilación**: El código compila sin errores con `mvn -q -DskipTests=false clean verify`
- [ ] **Cobertura**: JaCoCo muestra ≥ 70% de cobertura (o se justifica por qué es menor)
- [ ] **Tests**: Se agregaron/actualizaron tests para cubrir CRUD/errores/contrato según corresponda
- [ ] **Allure**: Se añadieron etiquetas apropiadas (`@Epic`, `@Feature`, `@Story`) si aplica
- [ ] **JSON Schema**: Se actualizaron los esquemas en `src/test/resources/esquemas/` si cambió el contrato
- [ ] **CI**: GitHub Actions pasa correctamente (build + tests + reportes)
- [ ] **Documentación**: Se actualizó README.md u otra documentación si corresponde

## 🧪 Cómo probar

<!-- (Opcional) Pasos manuales para verificar el cambio -->

### Curl de ejemplo:
```bash
# Ejemplo para probar manualmente
curl -X POST http://localhost:8080/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Nuevo Producto", "precio": 1500.0, "stock": 10}'
```

### Endpoints afectados:
- [ ] `GET /api/productos`
- [ ] `GET /api/productos/{id}`
- [ ] `POST /api/productos`
- [ ] `PUT /api/productos/{id}`
- [ ] `DELETE /api/productos/{id}`

## 📊 Métricas

<!-- Si es relevante, incluye capturas de cobertura, performance, etc. -->

---

### 📋 Notas adicionales

<!-- Cualquier información extra que ayude al review (decisiones técnicas, alternativas consideradas, etc.) -->