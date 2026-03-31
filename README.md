# Sistema Solar en WebGL + TWGL

## Nombre, Apellido y carnets

Angel Rodriguez 15-11669
Abel Zabaleta 15-11574

---

## Sistema Solar

Este proyecto consiste en una **simulación interactiva del sistema solar en miniatura**, desarrollada utilizando **WebGL y la librería TWGL**.

El sistema representa planetas como esferas generadas proceduralmente mediante una **icoesfera subdividida**, incorporando:

- Iluminación puntual desde el Sol  
- Texturas aplicadas a cuerpos celestes  
- Sistema modular de planetas  
- Shader programable (vertex y fragment shaders)  

---

## Requisitos previos

*   [Node.js](https://nodejs.org/) instalado en tu computadora.

## Cómo ejecutar el proyecto

1.  Abre una terminal y navega hasta la carpeta de este proyecto.
2.  Instala las dependencias necesarias ejecutando:
    ```bash
    npm install
    ```
3.  Inicia el servidor local ejecutando:
    ```bash
    npm start
    ```
4.  Abre tu navegador web y ve a la siguiente dirección:
    [http://localhost:3000](http://localhost:3000)

## Archivos principales

*   `src/main.js`: Contiene la lógica principal de renderizado, la estructura de los planetas y el bucle de animación.
*   `src/utils.js`: Contiene la función para generar la icoesfera (geometría de los planetas).
*   `assets/shaders/`: Contiene los shaders (Vertex y Fragment) utilizados para dibujar y dar color a los planetas.
*   `assets/textures/`: contiene la imagenes jpg/png usadas para la creacion de textuas de los planetas y el sol
