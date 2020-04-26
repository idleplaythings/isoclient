const ResizeFragmentShader = `
   uniform sampler2D map;
   uniform int borders;
   varying vec2 vUv;

 

   void main() {
        vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);

        if (borders == 1 && (vUv.x > 0.99 || vUv.x < 0.01 || vUv.y > 0.99 || vUv.y < 0.01)) {
            finalColor = vec4(1.0, 0.0, 0.0, 1.0);
        } else {
            finalColor = texture2D(map, vUv);
        }

        gl_FragColor = vec4(finalColor.rgb, 1.0);
   }
`;

export default ResizeFragmentShader;
