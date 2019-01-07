const CubeTileVertexShader = `
    precision highp float;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    attribute vec3 position;
    attribute vec3 offset;
    attribute float opacity;
    attribute vec2 uv;
    attribute vec3 textureNumber;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec3 vTextureNumber;

    void main() {
        vUv = uv;
        vOpacity = opacity;
        vTextureNumber = textureNumber;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + position, 1.0 );
    }

`;

export default CubeTileVertexShader;
