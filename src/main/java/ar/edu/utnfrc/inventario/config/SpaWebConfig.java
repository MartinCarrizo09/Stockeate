package ar.edu.utnfrc.inventario.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Fallback de SPA: en producción, cualquier ruta que no sea /api/**
 * debe resolver al index.html para que el frontend maneje el enrutado.
 */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/{spring:(?!api|h2-console).*$}").setViewName("forward:/index.html");
    }
}

