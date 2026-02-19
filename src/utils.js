// utils.js
function createIcosphere(radius = 1, subdivisions = 2) {
  // Vértices de un icosaedro (20 caras triangulares)
  const t = (1.0 + Math.sqrt(5.0)) / 2.0;
  const vertices = [
    -1, t, 0,   1, t, 0,   -1, -t, 0,   1, -t, 0,
    0, -1, t,   0, 1, t,   0, -1, -t,   0, 1, -t,
    t, 0, -1,   t, 0, 1,   -t, 0, -1,   -t, 0, 1
  ];

  // Normalizar vértices base
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    const length = Math.sqrt(x * x + y * y + z * z);

    vertices[i] = x / length;
    vertices[i + 1] = y / length;
    vertices[i + 2] = z / length;
  }

  // Índices de las caras (triángulos)
  const indices = [
    0, 11, 5,   0, 5, 1,   0, 1, 7,   0, 7, 10,  0, 10, 11,
    1, 5, 9,    5, 11, 4,  11, 10, 2,  10, 7, 6,  7, 1, 8,
    3, 9, 4,    3, 4, 2,   3, 2, 6,   3, 6, 8,   3, 8, 9,
    4, 9, 5,    2, 4, 11,  6, 2, 10,  8, 6, 7,   9, 8, 1
  ];

  // Subdividir los triángulos (simplificado)
  const positions = [];
  const colors = [];
  const finalIndices = [];

  // Función para subdividir un triángulo
  function subdivide(v1, v2, v3, depth) {
    if (depth === 0) {
      finalIndices.push(positions.length / 3, (positions.length + 3) / 3, (positions.length + 6) / 3);
      positions.push(...v1, ...v2, ...v3);
      colors.push(...getRandomColor(), ...getRandomColor(), ...getRandomColor());
      return;
    }

    // Puntos medios
    const v12 = normalize([(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2]);
    const v23 = normalize([(v2[0] + v3[0]) / 2, (v2[1] + v3[1]) / 2, (v2[2] + v3[2]) / 2]);
    const v31 = normalize([(v3[0] + v1[0]) / 2, (v3[1] + v1[1]) / 2, (v3[2] + v1[2]) / 2]);

    // Subdividir recursivamente
    subdivide(v1, v12, v31, depth - 1);
    subdivide(v2, v23, v12, depth - 1);
    subdivide(v3, v31, v23, depth - 1);
    subdivide(v12, v23, v31, depth - 1);
  }

  // Normalizar un vector
  function normalize(v) {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / length, v[1] / length, v[2] / length];
  }

  // Generar un color aleatorio
  function getRandomColor() {
    return [Math.random(), Math.random(), Math.random()];
  }

  // Crear la icoesfera
  for (let i = 0; i < indices.length; i += 3) {
    const v1 = [vertices[indices[i] * 3], vertices[indices[i] * 3 + 1], vertices[indices[i] * 3 + 2]];
    const v2 = [vertices[indices[i + 1] * 3], vertices[indices[i + 1] * 3 + 1], vertices[indices[i + 1] * 3 + 2]];
    const v3 = [vertices[indices[i + 2] * 3], vertices[indices[i + 2] * 3 + 1], vertices[indices[i + 2] * 3 + 2]];
    subdivide(v1, v2, v3, subdivisions);
  }

  // Escalar los vértices al radio deseado
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const length = Math.sqrt(x * x + y * y + z * z);
    positions[i] = (x / length) * radius;
    positions[i + 1] = (y / length) * radius;
    positions[i + 2] = (z / length) * radius;
  }

  const normals = [];

  // En una esfera centrada en el origen:
  // normal = posición normalizada
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    const length = Math.sqrt(x * x + y * y + z * z);

    normals.push(x / length, y / length, z / length);
  }

  return {
    position: { numComponents: 3, data: new Float32Array(positions) },
    normal: { numComponents: 3, data: new Float32Array(normals) },
    indices: { numComponents: 1, data: new Uint16Array(finalIndices) },
  };
}
