function createPlanet(gl, radius, subdivisions, color, distanceFromSun) {
  const { positions, normals, colors, indices } = createIcosphere(radius, subdivisions);

  // Crear buffers con TWGL
  const arrays = {
    position: positions,
    normal: normals,
    color: colors.map(() => color), // Asignar un color fijo al planeta
    indices: indices,
  };

  return twgl.primitives.createBufferInfoFromArrays(gl, arrays);
}
async function loadPlanet(gl, url, color) {
  const planetBufferInfo = await twgl.primitives.loadBufferInfoFromURL(gl, url);
  // Asignar un color a todos los vértices (opcional)
  const colors = new Float32Array(planetBufferInfo.attribs.position.numComponents * planetBufferInfo.attribs.position.numElements);
  colors.fill(...color); // Ej: [1, 0.8, 0] para el sol
  planetBufferInfo.attribs.color = { numComponents: 3, data: colors };
  return planetBufferInfo;
}

// Uso:
const sun = await loadPlanet(gl, "assets/models/planet.obj", [1, 0.8, 0]);
