const CubeTileVertexShader = `
    precision highp float;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    attribute vec3 position;
    attribute vec3 offset;
    attribute float opacity;
    attribute vec2 uv;
    attribute vec4 textureNumber1;
    attribute vec4 textureNumber2;
    attribute vec3 type;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec4 vTextureNumber1;
    varying vec4 vTextureNumber2;
    varying vec3 vType;

    
    float isFlipped() {
        if (type.z > 0.0) {
            return 1.0;
        } else {
            return 0.0;
        }
    }

    float getScale() {
        return type.y;
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
        vTextureNumber1 = textureNumber1;
        vTextureNumber2 = textureNumber2;

        if (opacity == 0.0){
            gl_Position = vec4(0.0);
        } else {
            vec3 vPosition = applyQuaternionToVector(position );
    
            gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + vPosition * getScale(), 1.0 );
        }
    }

`;

export default CubeTileVertexShader;
