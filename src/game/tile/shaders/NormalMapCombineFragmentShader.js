const NormalMapCombineFragmentShader = `
   uniform sampler2D mapA;
   uniform sampler2D mapB;
   varying vec2 vUv;

 

   void main() {
        vec4 c1 = texture2D(mapA, vUv);
        vec4 c2 = texture2D(mapB, vUv);

        //c2.a *= 5.0;
        c1 -= vec4(0.5, 0.5, 1.0, 0.0);
        c2 -= vec4(0.5, 0.5, 1.0, 0.0);

        c2 *= 1.5;

        float totalAlpha = c1.a + c2.a;

        vec3 finalColor = vec3(0.5, 0.5, 1.0) + (c1.xyz * (c1.a / totalAlpha)) + (c2.xyz * (c2.a / totalAlpha));

        gl_FragColor = vec4(finalColor, 1.0);
   }
`;

export default NormalMapCombineFragmentShader;
