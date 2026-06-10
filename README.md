# Generador de Utilidades

Sitio estático con tres herramientas para desarrollo: texto Lorem Ipsum, emails de prueba y contraseñas seguras.

**🔗 [Ver sitio en vivo](https://migueltapiaurrutia.github.io/generador-utilidades/)**

## Funcionalidades

- **Lorem Ipsum**: genera de 1 a 10 párrafos de texto de relleno, con copiado al portapapeles.
- **Emails de prueba**: genera hasta 20 emails ficticios únicos con nombres y apellidos comunes en Chile.
- **Contraseñas**: genera contraseñas de 8 a 64 caracteres con tipos configurables, usando `crypto.getRandomValues` para azar criptográficamente seguro.

## Tecnologías

- HTML5 semántico
- CSS3 con design tokens (variables CSS)
- JavaScript vanilla (ES6+)

## Decisiones técnicas

- **Separación lógica/DOM**: las funciones generadoras son puras (reciben datos, devuelven datos); la manipulación del DOM vive aparte, lo que facilita testear y mantener cada parte.
- **`crypto.getRandomValues` en vez de `Math.random`**: las contraseñas requieren azar impredecible; se usa el CSPRNG del sistema con muestreo por rechazo para evitar sesgo de módulo, y mezcla Fisher-Yates.
- **Diseño neo-brutalista con tokens**: colores, bordes, sombras y tipografía definidos como variables CSS en `:root`, de modo que el sistema visual se ajusta desde un solo lugar.
- **Accesibilidad básica**: labels asociados a cada control, foco siempre visible (`:focus-visible`), contraste AA verificado y respeto a `prefers-reduced-motion`.

## Ejecutar localmente

Clonar el repositorio y abrir `index.html` en el navegador; no requiere dependencias ni build.

```bash
git clone https://github.com/MiguelTapiaUrrutia/generador-utilidades.git
```

## Estado

✅ Completado
