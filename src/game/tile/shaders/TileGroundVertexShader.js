const TileGroundVertexShader = `
    attribute float opacity;
    varying vec2 vUv;
    varying float vOpacity;

    void main() {
        
        vUv = uv;
        vOpacity = opacity;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );      
      }

`;

export default TileGroundVertexShader;
