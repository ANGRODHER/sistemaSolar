// main.js
const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl2");
if (!gl) {
  alert("WebGL2 no disponible");
  throw new Error("WebGL2 no disponible");
}

// Configurar el canvas
canvas.width = 500; // Tamaño fijo para depuración
canvas.height = 500;
gl.viewport(0, 0, canvas.width, canvas.height);

// Shaders verificados
const vs = `
  attribute vec3 position;
  attribute vec3 color;
  uniform mat4 u_projection;
  uniform mat4 u_view;
  uniform mat4 u_model;
  varying vec3 v_color;
  void main() {
    gl_Position = u_projection * u_view * u_model * vec4(position, 1);
    v_color = color;
  }
`;

const fs = `
  precision mediump float;
  varying vec3 v_color;
  void main() {
    gl_FragColor = vec4(v_color, 1);
  }
`;

// Compilar el programa
const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
if (!programInfo) {
  console.error("Error al compilar los shaders");
}

// Matrices
const projection = twgl.m4.perspective(45 * Math.PI / 180, 1, 0.1, 1000);
const view = twgl.m4.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]);

// Datos de la icoesfera (icosaedro sin subdividir)
const vertices = [
  -1, 1.618, 0,   1, 1.618, 0,   -1, -1.618, 0,   1, -1.618, 0,
  0, -1, 1.618,   0, 1, 1.618,   0, -1, -1.618,   0, 1, -1.618,
  1.618, 0, -1,   1.618, 0, 1,   -1.618, 0, -1,   -1.618, 0, 1
];

const indices = [
  0, 11, 5,   0, 5, 1,   0, 1, 7,   0, 7, 10,  0, 10, 11,
  1, 5, 9,    5, 11, 4,  11, 10, 2,  10, 7, 6,  7, 1, 8,
  3, 9, 4,    3, 4, 2,   3, 2, 6,   3, 6, 8,   3, 8, 9,
  4, 9, 5,    2, 4, 11,  6, 2, 10,  8, 6, 7,   9, 8, 1
];

const positions = [];
const colors = [];
for (let i = 0; i < vertices.length; i += 3) {
  positions.push(vertices[i], vertices[i + 1], vertices[i + 2]);
  colors.push(Math.random(), Math.random(), Math.random());
}

const sunArrays = {
  position: { numComponents: 3, data: new Float32Array(positions) },
  color: { numComponents: 3, data: new Float32Array(colors) },
  indices: { numComponents: 1, data: new Uint16Array(indices) },
};

const sunBufferInfo = twgl.createBufferInfoFromArrays(gl, sunArrays);

// Renderizar
function render() {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(programInfo.program);

  const sunModel = twgl.m4.scaling([2, 2, 2]); // Escalar un poco
  twgl.setUniforms(programInfo, {
    u_projection: projection,
    u_view: view,
    u_model: sunModel,
  });

  twgl.setBuffersAndAttributes(gl, programInfo, sunBufferInfo);
  twgl.drawBufferInfo(gl, sunBufferInfo);

  requestAnimationFrame(render);
}

render();



