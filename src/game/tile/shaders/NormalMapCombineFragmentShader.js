const NormalMapCombineFragmentShader = `
   uniform sampler2D mapA;
   uniform sampler2D mapB;
   varying vec2 vUv;

 

   void main() {
        vec4 mapAColor = texture2D(mapA, vUv);
        vec4 mapBColor = texture2D(mapB, vUv) - vec4(0.5, 0.5, 0.5, 0.0);

        vec4 finalColor = vec4(
            mapAColor.r + mapBColor.r,
            mapAColor.g + mapBColor.g,
            mapAColor.b + mapBColor.b,
            1.0
        );

        gl_FragColor = finalColor;
   }
`;

export default NormalMapCombineFragmentShader;
