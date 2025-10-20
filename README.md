# Stockeate

**Suite REST (CRUD, contrato, errores) con datos externos, Allure, CI en Actions y cobertura JaCoCo**

![CI Status](https://github.com/tu-usuario/api-inventario/actions/workflows/maven-ci.yml/badge.svg)

> 📚 **Proyecto académico UTN-FRC** | Automatización de pruebas para API REST de inventario y precios

## 📋 Descripción

Este repositorio contiene una API REST simple para gestión de inventario y su suite completa de pruebas automatizadas. Implementa un CRUD básico para productos con validaciones, y una batería de tests que cubren casos felices, errores HTTP y validación de contratos JSON.

**Tecnologías principales:**
- **API**: Java 17 + Spring Boot 3.3 + H2 (en memoria)
- **Tests**: RestAssured + JUnit 5 + Allure
- **CI/CD**: GitHub Actions + Maven
- **Cobertura**: JaCoCo

## 🚀 Requisitos

- **JDK 17** (recomendado: Eclipse Temurin)
- **Maven 3.9+**
- **Puerto aleatorio** para tests (configurado automáticamente)

## 📁 Estructura del Proyecto

```
api-inventario/
├── src/main/java/ar/edu/utnfrc/inventario/
│   ├── AplicacionInventario.java          # Clase principal Spring Boot
│   ├── api/
│   │   ├── ProductoControlador.java       # REST Controller /api/productos
│   │   └── AsesorErrores.java             # Manejo global de errores
│   ├── dominio/
│   │   └── Producto.java                  # Entidad JPA (id, nombre, precio, stock, creadoEn)
│   ├── servicio/
│   │   └── ProductoServicio.java          # Lógica de negocio
│   └── repositorio/
│       └── ProductoRepositorio.java       # Acceso a datos JPA
├── src/test/java/ar/edu/utnfrc/inventario/pruebas/
│   ├── BaseIT.java                        # Configuración base para tests de integración
│   └── ProductoIT.java                    # Suite completa de tests REST
├── src/test/resources/
│   ├── datos/
│   │   ├── productos-validos.json         # Datos de prueba válidos
│   │   └── productos-invalidos.json       # Casos de error 400
│   └── esquemas/
│       └── producto-schema.json           # JSON Schema para validación de contrato
└── .github/workflows/
    └── maven-ci.yml                       # Pipeline CI/CD
```

## ⚡ Ejecución Rápida

### Levantar la API en desarrollo
```bash
mvn spring-boot:run
```
La API estará disponible en `http://localhost:8080/api/productos`

### Ejecutar la suite de pruebas
```bash
mvn clean verify
```

### Ver reportes localmente

**Allure** (requiere [Allure CLI](https://docs.qameta.io/allure/#_installing_a_commandline)):
```bash
allure serve target/allure-results
```

**Cobertura JaCoCo**:
Abrir en el navegador: `target/site/jacoco/index.html`

## 🧪 Cobertura de Tests

Los tests automatizan los siguientes escenarios:

- **CRUD completo**: Crear, obtener, listar, actualizar y eliminar productos
- **Validación de contratos**: Estructura JSON con JSON Schema
- **Casos de error**: 
  - `400 Bad Request` (datos inválidos)
  - `404 Not Found` (producto inexistente)
- **Datos externos**: Tests parametrizados con archivos JSON
- **Etiquetas Allure**: Epic/Feature/Story para reportes organizados

### Endpoints cubiertos:
```
POST   /api/productos      → 201 Created + Location header
GET    /api/productos/{id} → 200 OK | 404 Not Found  
GET    /api/productos      → 200 OK (lista)
PUT    /api/productos/{id} → 200 OK | 404 Not Found
DELETE /api/productos/{id} → 204 No Content | 404 Not Found
```

## 🔄 Integración Continua

El workflow `.github/workflows/maven-ci.yml` se ejecuta en cada push/PR:

1. **Build & Test**: `mvn clean verify` con JDK 17
2. **Artifacts**:
   - `allure-results`: Datos crudos para generar reportes Allure
   - `jacoco-report`: Reporte HTML de cobertura

### Badge de cobertura JaCoCo
Para mostrar la cobertura automáticamente, puedes usar servicios como [Codecov](https://codecov.io/) o configurar tu propio badge. Agrega al workflow:

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: target/site/jacoco/jacoco.xml
```
