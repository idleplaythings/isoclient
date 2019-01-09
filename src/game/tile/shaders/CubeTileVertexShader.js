const CubeTileVertexShader = `
    precision highp float;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    attribute vec3 position;
    attribute vec3 offset;
    attribute float opacity;
    attribute vec2 uv;
    attribute vec4 textureNumber;
    attribute vec4 brushNumber;
    attribute float type;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec4 vTextureNumber;
    varying vec4 vBrushNumber;
    varying float vType;

    
    float isFlipped() {
        if (type == 2.0 || type == 3.0) {
            return 1.0;
        } 

        return 0.0;
    }

    //type => 00 normal, 01 scale 2, 10 flipped, 11 scale 2 and flipped
    float getScale() {
        if (type == 1.0 || type == 3.0) {
            return 2.0;
        } 

        return 1.0;
    }

    // http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
    vec3 applyQuaternionToVector(vec3 v ){
 
        if (isFlipped() == 1.0) {
            vec4 q = normalize(vec4(1,1,0,0));
            return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
        } 

        return v;
    }

    void main() {
        vType = type;
        vUv = uv;
        vOpacity = opacity;
        vTextureNumber = textureNumber;
        vBrushNumber = brushNumber;

        vec3 vPosition = applyQuaternionToVector(position );

        gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + vPosition * getScale(), 1.0 );
    }

`;

export default CubeTileVertexShader;
