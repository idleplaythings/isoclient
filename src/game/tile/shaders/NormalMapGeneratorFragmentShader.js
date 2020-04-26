/*

    uniform sampler2D texture;
    uniform float overlayAlpha;
    uniform vec3 overlayColor;
    uniform float opacity;
    */

const NormalMapGeneratorFragmentShader = `

   #extension GL_OES_standard_derivatives : enable

   uniform sampler2D heightMap;
   uniform float size;
   uniform int borders;

   varying vec2 vUv;
   varying vec3 vViewPosition;

 
   
   vec2 dHdxy_fwd() {
       float bumpScale = 3.5;
       vec2 dSTdx = dFdx( vUv );
       vec2 dSTdy = dFdy( vUv );

       float Hll = bumpScale * texture2D( heightMap, vUv ).x;
       float dBx = bumpScale * texture2D( heightMap, vUv + dSTdx ).x - Hll;
       float dBy = bumpScale * texture2D( heightMap, vUv + dSTdy ).x - Hll;

       return vec2( dBx, dBy );

   }

   vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {

       // Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

       vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );
       vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );
       vec3 vN = surf_norm;		// normalized

       vec3 R1 = cross( vSigmaY, vN );
       vec3 R2 = cross( vN, vSigmaX );

       float fDet = dot( vSigmaX, R1 );

       fDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

       vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
       return normalize( abs( fDet ) * surf_norm - vGrad );

   }
   

   void main() {
        vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);

        if (borders == 1 && (vUv.x > 0.99 || vUv.x < 0.01 || vUv.y > 0.99 || vUv.y < 0.01)) {
            finalColor = vec4(1.0, 0.0, 0.0, 1.0);
        } else {
            
            vec3 normal = perturbNormalArb( -vViewPosition, vec3(0.5, 0.5, 1.0), dHdxy_fwd() );
            finalColor = vec4(normal.rgb, 1.0);
        }

        gl_FragColor = vec4(finalColor.rgb, 1.0);
   }
`;

/*

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

export default NormalMapGeneratorFragmentShader;
