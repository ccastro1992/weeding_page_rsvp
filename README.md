# Invitación de Boda Digital

Este proyecto es una aplicación web personalizada desarrollada con motivo de mi boda. El objetivo principal es proporcionar una experiencia interactiva y elegante para los invitados, permitiéndoles visualizar los detalles del evento, confirmar su asistencia y acceder a información relevante de una manera digital y sostenible.

## Características Principales

- **Invitaciones Personalizadas**: Sistema de rutas dinámicas que permite generar invitaciones únicas para cada invitado o familia mediante identificadores extraídos de una base de datos.
- **Experiencia Interactiva**: Incluye un sobre virtual animado que los invitados deben "abrir" para revelar el contenido de la invitación.
- **Confirmación de Asistencia (RSVP)**: Integración con Supabase para gestionar las respuestas de los invitados en tiempo real.
- **Detalles del Evento**: Secciones dedicadas para la ceremonia, la recepción (quinta), código de vestimenta y ubicación con mapas.
- **Mesa de Regalos**: Módulo informativo con datos bancarios y opciones para presentes.
- **Ambientación Musical**: Reproducción de música de fondo con controles de usuario para una experiencia inmersiva.
- **Diseño Responsivo**: Totalmente adaptado para dispositivos móviles, facilitando el acceso desde cualquier lugar.

## Tecnologías Utilizadas

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos y Backend**: [Supabase](https://supabase.com/)
- **Estilos**: CSS nativo con variables personalizadas y utilidades.
- **Iconografía**: [Lucide React](https://lucide.dev/)

## Estructura del Proyecto

```text
├── src/
│   ├── app/                # Rutas y páginas (Next.js App Router)
│   │   └── invitation/     # Lógica de invitaciones dinámicas [id]
│   ├── components/         # Componentes modulares (Sobre, Secciones, Modales)
│   ├── lib/                # Configuración de clientes (Supabase)
│   └── public/             # Recursos estáticos (Imágenes, Audio)
```

## Configuración Local

Si deseas ejecutar este proyecto localmente para fines de desarrollo o referencia:

1. **Clonar el repositorio**
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```
4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

---
*Este es un proyecto personal desarrollado con mucho cariño para un día muy especial.*
