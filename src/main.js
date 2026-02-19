// main.js
const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl2");
if (!gl) {
  alert("WebGL2 no disponible");
  throw new Error("WebGL2 no disponible");
}

// Configurar el canvas
//canvas.width = canvas.clientWidth;
//canvas.height = canvas.clientHeight;
//gl.viewport(0, 0, canvas.width, canvas.height);


async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}
let programInfo;

async function init() {
  const vs = await loadShader("assets/shaders/vertex.glsg");
  const fs = await loadShader("assets/shaders/fragment.glsg");

  programInfo = twgl.createProgramInfo(gl, [vs, fs]);

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

const camera = twgl.m4.lookAt([0, 0, 10], [0, 0, 0], [0, 1, 0]);
const view = twgl.m4.inverse(camera);

const sphereData = createIcosphere(1, 2);
const sunBufferInfo = twgl.createBufferInfoFromArrays(gl, sphereData);

// Renderizar
function render() {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(programInfo.program);

  const sunModel = twgl.m4.scaling([2, 2, 2]); // Escalar un poco
  twgl.setUniforms(programInfo, {
    u_projection: projection,
    u_view: view,
    u_model: sunModel,
    u_lightDirection: [1, 1, 1],
  });


  twgl.setBuffersAndAttributes(gl, programInfo, sunBufferInfo);
  twgl.drawBufferInfo(gl, sunBufferInfo);

  requestAnimationFrame(render);
}





