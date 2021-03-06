const CubeTileVertexShader = `
    precision highp float;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float time;
    attribute vec3 position;
    attribute vec3 offset;
    attribute float opacity;
    attribute vec2 uv;
    attribute vec4 textureNumber1;
    attribute vec4 textureNumber2;
    attribute vec3 type;
    attribute float textureVariant;

    varying vec2 vUv;
    varying float vOpacity;
    varying vec4 vTextureNumber1;
    varying vec4 vTextureNumber2;
    varying vec3 vType;
    varying float vTextureVariant;
    varying vec3 vViewPosition;
    varying vec3 vPosition;

    
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
        vTextureVariant = textureVariant;

        vec3 offsetPosition = offset + applyQuaternionToVector(position) * getScale();
        vPosition = offsetPosition;

        vec4 mvPosition = modelViewMatrix * vec4( offsetPosition, 1.0 );
        vViewPosition = -mvPosition.xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4( offsetPosition, 1.0 );      
      }

`;

export default CubeTileVertexShader;
