/*

    uniform sampler2D texture;
    uniform float overlayAlpha;
    uniform vec3 overlayColor;
    uniform float opacity;
    */

const GroundFragmentShader = `

    uniform sampler2D heightMap;
    uniform float size;

    varying vec2 vUv;

  
    vec2 groundUv() {

        float groundSize = size + 2.0;
        float groundTileSize = 1.0 / groundSize;

        return vec2(
            vUv.x * 0.5 + 0.25,
            vUv.y * 0.5 + 0.25
        );
    }

    vec2 getNormal() {
        vec2 normalUV =  groundUv();
        float u = 1.0 / (size * 2.0);

        const vec2 texsize = vec2(2.0,0.0);
        const ivec3 off = ivec3(-u,0.0,u);

        vec4 wave = texture2D(heightMap, normalUV);
        float s11 = wave.x;
        float s01 = texture2D(heightMap, normalUV + off.xy).x;
        float s21 = texture2D(heightMap, normalUV + off.zy).x;
        float s10 = texture2D(heightMap, normalUV + off.yx).x;
        float s12 = texture2D(heightMap, normalUV + off.yz).x;
        vec3 va = normalize(vec3(texsize.xy,s21-s01));
        vec3 vb = normalize(vec3(texsize.yx,s12-s10));
        vec4 bump = vec4( cross(va,vb), s11 );
    }

    

    void main() {
        vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);

        //if (vUv.x > 0.99 || vUv.x < 0.01 || vUv.y > 0.99 || vUv.y < 0.01) {
        //    finalColor = vec4(0.0, 0.0, 1.0, 1.0);
        //} else {
            finalColor = texture2D(heightMap, groundUv());
        //}


        gl_FragColor = finalColor;
    }
`;

/*
https://stackoverflow.com/questions/5281261/generating-a-normal-map-from-a-height-map/5284527#5284527

height map to surface normal

uniform sampler2D unit_wave
noperspective in vec2 tex_coord;
const vec2 size = vec2(2.0,0.0);
const ivec3 off = ivec3(-1,0,1);

    vec4 wave = texture(unit_wave, tex_coord);
    float s11 = wave.x;
    float s01 = textureOffset(unit_wave, tex_coord, off.xy).x;
    float s21 = textureOffset(unit_wave, tex_coord, off.zy).x;
    float s10 = textureOffset(unit_wave, tex_coord, off.yx).x;
    float s12 = textureOffset(unit_wave, tex_coord, off.yz).x;
    vec3 va = normalize(vec3(size.xy,s21-s01));
    vec3 vb = normalize(vec3(size.yx,s12-s10));
    vec4 bump = vec4( cross(va,vb), s11 );

    */
export default GroundFragmentShader;
