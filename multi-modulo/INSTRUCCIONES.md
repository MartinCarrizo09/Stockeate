# Guía: Estructura Multi-Módulo

Esta guía explica cómo reorganizar el proyecto actual en una estructura multi-módulo que separe la API de las pruebas.

## 🎯 Objetivo

Separar responsabilidades en dos módulos independientes:
- **`api/`**: La aplicación Spring Boot
- **`pruebas-api/`**: Los tests de integración con RestAssured

## 📁 Estructura Final

```
api-inventario/                           # Proyecto padre
├── pom.xml                              # POM padre (packaging=pom)
├── api/                                 # Módulo de la aplicación
│   ├── pom.xml                         # Dependencias de Spring Boot
│   └── src/main/java/...               # Código de la API
├── pruebas-api/                        # Módulo de tests
│   ├── pom.xml                         # Dependencias de RestAssured + JUnit
│   └── src/test/java/...               # Tests de integración
└── .github/workflows/maven-ci.yml       # CI ajustado para multi-módulo
```

## 🚀 Pasos para Migrar

### 1. Crear estructura de directorios

```bash
# Desde la raíz del proyecto
mkdir api pruebas-api
```

### 2. Mover código existente

```bash
# Mover la aplicación al módulo api/
mkdir -p api/src
mv src/main api/src/

# Mover tests al módulo pruebas-api/
mkdir -p pruebas-api/src
mv src/test pruebas-api/src/
mv src/test pruebas-api/src/  # Si quedó algo

# Limpiar directorio raíz
rm -rf src target
```

### 3. Crear POMs

#### 3.1 POM Padre (`pom.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>ar.edu.utnfrc</groupId>
  <artifactId>api-inventario</artifactId>
  <version>1.0.0-SNAPSHOT</version>
  <packaging>pom</packaging>
  
  <name>API Inventario (Multi-Módulo)</name>
  <description>API REST + Suite de Pruebas separadas en módulos</description>

  <!-- Módulos hijos -->
  <modules>
    <module>api</module>
    <module>pruebas-api</module>
  </modules>

  <properties>
    <java.version>17</java.version>
    <maven.compiler.release>17</maven.compiler.release>
    <spring-boot.version>3.3.4</spring-boot.version>
    <restassured.version>5.4.0</restassured.version>
    <allure.junit5.version>2.25.0</allure.junit5.version>
    <surefire.version>3.2.5</surefire.version>
    <jacoco.version>0.8.11</jacoco.version>
  </properties>

  <!-- Gestión de dependencias compartidas -->
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>${spring-boot.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
      <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>${restassured.version}</version>
      </dependency>
      <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>json-schema-validator</artifactId>
        <version>${restassured.version}</version>
      </dependency>
      <dependency>
        <groupId>io.qameta.allure</groupId>
        <artifactId>allure-junit5</artifactId>
        <version>${allure.junit5.version}</version>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <build>
    <pluginManagement>
      <plugins>
        <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
          <version>${spring-boot.version}</version>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>${surefire.version}</version>
        </plugin>
        <plugin>
          <groupId>org.jacoco</groupId>
          <artifactId>jacoco-maven-plugin</artifactId>
          <version>${jacoco.version}</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```

#### 3.2 POM del módulo API (`api/pom.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>ar.edu.utnfrc</groupId>
    <artifactId>api-inventario</artifactId>
    <version>1.0.0-SNAPSHOT</version>
  </parent>

  <artifactId>api</artifactId>
  <name>API Inventario - Aplicación</name>
  <description>API REST para gestión de inventario y precios</description>

  <dependencies>
    <!-- Spring Boot -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Base de datos -->
    <dependency>
      <groupId>com.h2database</groupId>
      <artifactId>h2</artifactId>
      <scope>runtime</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```

#### 3.3 POM del módulo Pruebas (`pruebas-api/pom.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>ar.edu.utnfrc</groupId>
    <artifactId>api-inventario</artifactId>
    <version>1.0.0-SNAPSHOT</version>
  </parent>

  <artifactId>pruebas-api</artifactId>
  <name>API Inventario - Pruebas</name>
  <description>Suite de pruebas de integración con RestAssured</description>

  <dependencies>
    <!-- Dependencia al módulo API (para levantar la app en tests) -->
    <dependency>
      <groupId>ar.edu.utnfrc</groupId>
      <artifactId>api</artifactId>
      <version>${project.version}</version>
      <scope>test</scope>
    </dependency>

    <!-- Testing -->
    <dependency>
      <groupId>io.rest-assured</groupId>
      <artifactId>rest-assured</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>io.rest-assured</groupId>
      <artifactId>json-schema-validator</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>io.qameta.allure</groupId>
      <artifactId>allure-junit5</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <!-- Surefire para ejecutar tests -->
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
      </plugin>
      
      <!-- JaCoCo para cobertura -->
      <plugin>
        <groupId>org.jacoco</groupId>
        <artifactId>jacoco-maven-plugin</artifactId>
        <executions>
          <execution>
            <goals>
              <goal>prepare-agent</goal>
            </goals>
          </execution>
          <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals>
              <goal>report</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
```

### 4. Copiar recursos

```bash
# Copiar application.properties al módulo api
cp src/main/resources/application.properties api/src/main/resources/

# Los recursos de test ya están en pruebas-api/src/test/resources/
```

## 🔧 Comandos de Uso

### Compilar todo el proyecto
```bash
# Desde la raíz
mvn clean verify
```

### Compilar módulos específicos
```bash
# Solo la API
mvn -am -pl api clean verify

# Solo las pruebas
mvn -am -pl pruebas-api clean verify

# API + Pruebas (explícito)
mvn -am -pl api,pruebas-api clean verify
```

### Ejecutar la API en desarrollo
```bash
# Opción 1: desde la raíz
mvn -f api/pom.xml spring-boot:run

# Opción 2: desde el módulo
cd api && mvn spring-boot:run
```

### Ejecutar solo los tests
```bash
# Opción 1: desde la raíz
mvn -f pruebas-api/pom.xml test

# Opción 2: desde el módulo
cd pruebas-api && mvn test
```

## 🔄 Ajustar CI (GitHub Actions)

Actualizar `.github/workflows/maven-ci.yml`:

```yaml
name: CI Maven Multi-Módulo

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'maven'

      - name: Build & Test Multi-Módulo
        run: mvn -B -q clean verify

      - name: Subir resultados Allure
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results
          path: "**/allure-results"

      - name: Subir reportes JaCoCo
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: jacoco-report
          path: "**/target/site/jacoco"
```

## ✅ Verificación

Después de la migración, verificar que todo funciona:

```bash
# 1. Compilar todo
mvn clean verify

# 2. Levantar API
mvn -f api/pom.xml spring-boot:run &
API_PID=$!

# 3. En otra terminal, probar endpoint
curl http://localhost:8080/api/productos

# 4. Matar la API
kill $API_PID

# 5. Ejecutar solo tests
mvn -f pruebas-api/pom.xml test

# 6. Verificar reportes
ls pruebas-api/target/site/jacoco/
ls pruebas-api/target/allure-results/
```

## 🎯 Ventajas de Multi-Módulo

- **Separación clara**: API y tests en módulos independientes
- **Deploy selectivo**: Se puede buildear solo la API para producción
- **Ciclos independientes**: Los tests pueden evolucionar sin afectar la API
- **Reutilización**: Otros proyectos pueden depender del módulo `api`
- **Organización**: Estructura más escalable para equipos

## 📝 Próximos Pasos

1. Migrar siguiendo esta guía
2. Crear rama `multi-modulo` en Git
3. Testear comandos localmente
4. Verificar CI en GitHub Actions
5. Comparar tiempos de build vs monorepo original

---

**💡 Tip**: Mantén el proyecto monorepo original como `main` y usa `multi-modulo` como rama experimental hasta estar seguro de la migración.