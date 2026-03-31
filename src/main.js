// main.js
const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl2");

function loadTexture(url) {
  
  return twgl.createTexture(gl, {
    src: url,
    flipY: true,
    wrap: gl.REPEAT,
  });
}


if (!gl) {
  alert("WebGL2 no disponible");
  throw new Error("WebGL2 no disponible");
}

async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}
let programInfo;

async function init() {
  const vs = await loadShader("assets/shaders/vertex.glsg");
  const fs = await loadShader("assets/shaders/fragment.glsg");

  programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  textures.earth = twgl.createTexture(gl, {
    src: "assets/textures/earth.jpg",
  });

  textures.moon = twgl.createTexture(gl, {
    src: "assets/textures/moon.jpg",
  });

  textures.sun = twgl.createTexture(gl, {
    src: "assets/textures/sun.jpg",
  });

  render();
}

init();

// Matrices
const aspect = canvas.clientWidth / canvas.clientHeight;

const projection = twgl.m4.perspective(
  45 * Math.PI / 180,
  aspect,
  0.1,
  1000
);

const camera = twgl.m4.lookAt([0, 50, 90], [0, 0, 0], [0, 1, 0]);
const view = twgl.m4.inverse(camera);

// Parametros de la esfera: tamaño, color, divisiones
const sphereData = createIcosphere(1, 4); // usamos 4 subdivisiones para que se vea mas redondo
const sphereBufferInfo = twgl.createBufferInfoFromArrays(gl, sphereData);

const textures = {
  sun: loadTexture("assets/textures/sun.jpg"),
  earth: loadTexture("assets/textures/earth.jpg"),
  moon: loadTexture("assets/textures/moon.jpg"),
  jupiter: loadTexture("assets/textures/jupiter.png"),
};

// Estructura de datos para los planetas
const solarSystem = {
  name: "Sol",
  distance: 0,
  speed: 0,
  radius: 5,
  color: [1.0, 0.8, 0.0], // Amarillo
  children: [
    {
      name: "Mercurio",
      distance: 8,
      speed: 1.5,
      radius: 0.8,
      color: [0.7, 0.7, 0.7], // Gris
      children: []
    },
    {
      name: "Venus",
      distance: 12,
      speed: 1.2,
      radius: 1.2,
      color: [0.9, 0.8, 0.5], // Amarillento
      children: []
    },
    {
      name: "Tierra",
      distance: 18,
      speed: 1.0,
      radius: 1.3,
      color: [0.2, 0.4, 0.8], // Azul
      children: [
        {
          name: "Luna",
          distance: 2.5,
          speed: 3.0,
          radius: 0.3,
          color: [0.6, 0.6, 0.6], // gris
          children: []
        }
      ]
    },
    {
      name: "Marte",
      distance: 24,
      speed: 0.8,
      radius: 1.0,
      color: [0.8, 0.3, 0.2], // Rojizo
      children: []
    },
    {
      name: "Jupiter",
      distance: 36,
      speed: 0.4,
      radius: 3.5,
      color: [0.8, 0.6, 0.4], // Marron
      children: []
    },
    {
      name: "Saturno",
      distance: 50,
      speed: 0.3,
      radius: 3.0,
      color: [0.9, 0.8, 0.6], // Dorado
      children: []
    }
  ]
};

// Renderizar
function render(time) {
  time = time * 0.001;
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(programInfo.program);

  let uniforms = {
    u_projection: projection,
    u_view: view,
    u_lightPosition: [0, 0, 0], // EL SOL ES LA LUZ
  };
  twgl.setUniforms(programInfo, uniforms);

  // Funcion recursiva para dibujar cada planeta
  function drawPlanet(planet, parentMatrix) {
    let orbitAngle = time * planet.speed; //Rotacion de la orbita
    let orbitMatrix = twgl.m4.axisRotate(parentMatrix, [0, 1, 0], orbitAngle);

    let positionMatrix = twgl.m4.translate(orbitMatrix, [planet.distance, 0, 0]); //Translacion
    let selfRotationMatrix = twgl.m4.axisRotate(positionMatrix, [0, 1, 0], time); //Rotacion sobre si mismo
    let modelMatrix = twgl.m4.scale(selfRotationMatrix, [planet.radius, planet.radius, planet.radius]); //Escalar

    let useTexture = false;
    let texture = null;

    // Solo la Tierra tendrá textura por ahora
    if (planet.name === "Tierra") {
      useTexture = true;
      texture = textures.earth;
    }
    if (planet.name === "Luna") {
      useTexture = true;
      texture = textures.moon;
    }
    if (planet.name === "Jupiter") {
      useTexture = true;
      texture = textures.jupiter;
    }

    twgl.setUniforms(programInfo, {
      u_model: modelMatrix,
      u_color: planet.color,
      u_useTexture: useTexture,
      u_isSun: false,
    });

    // SOLO si hay textura, la enviamos
    if (useTexture) {
      twgl.setUniforms(programInfo, {
        u_texture: texture,
      });
    }

    twgl.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);
    twgl.drawBufferInfo(gl, sphereBufferInfo);

    // Recussividad para los hijos
    if (planet.children && planet.children.length > 0) {
      for (let i = 0; i < planet.children.length; i++) {
        let currentChild = planet.children[i];
        drawPlanet(currentChild, positionMatrix);
      }
    }
  }

  // Dibujar al Sol
  let identity = twgl.m4.identity();
  let sunRotation = twgl.m4.axisRotate(identity, [0, 1, 0], time * 0.1);

  twgl.setUniforms(programInfo, {
    u_model: twgl.m4.scale(sunRotation, [solarSystem.radius, solarSystem.radius, solarSystem.radius]),
    u_color: solarSystem.color,
    u_useTexture: true,
    u_texture: textures.sun,
    u_isSun: true
  });
  twgl.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);
  twgl.drawBufferInfo(gl, sphereBufferInfo);

  // Dibujar todos los planetas
  for (let i = 0; i < solarSystem.children.length; i++) {
    drawPlanet(solarSystem.children[i], identity);
  }

  requestAnimationFrame(render);
}
