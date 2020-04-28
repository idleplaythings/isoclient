const SmoothNormalMapFragmentShader = `

   #extension GL_OES_standard_derivatives : enable

   uniform sampler2D map;
   uniform float pixelSize;
   uniform float tileSize;

   varying vec2 vUv;


   vec4 combineNormals(vec4 c1, vec4 c2) {
        c1 -= vec4(0.5, 0.5, 1.0, 0.0);
        c2 -= vec4(0.5, 0.5, 1.0, 0.0);
        float totalAlpha = c1.a + c2.a;

        return vec4(0.5, 0.5, 1.0, 1.0) + (c1 * (c1.a / totalAlpha)) + (c2 * (c2.a / totalAlpha));
    }
 
    vec4 smooth() {

        vec4 baseNormal = texture2D(map, vUv);

        for (float x = -1.0; x <= 1.0; x += 1.0) {
		    for (float y = -1.0; y <= 1.0; y += 1.0) {

                if (x == 0.0 && y == 0.0) {
                    continue;
                }
              
                for (float step = 0.0; step < 3.0; step += 1.0) {
                    vec4 nextNormal = texture2D(map, vUv + (vec2(x, y) * ((tileSize * 0.2) * step)));
                    nextNormal.a *= 0.5;
    
                    baseNormal = combineNormals(baseNormal, nextNormal);
                }
            }
        }

        return baseNormal;
    }

    vec4 smooth2() {

        vec4 baseNormal = texture2D(map, vUv);
        vec2 normalStep = normalize(vec2(baseNormal.xy));

  
        for (float step = 0.0; step < 10.0; step += 1.0) {
            vec4 nextNormal = texture2D(map, vUv + (normalStep * pixelSize * 2.0 * step));
            //nextNormal.a *= 0.5;

            baseNormal = combineNormals(baseNormal, nextNormal);
        }
      
        for (float step = 0.0; step > 10.0; step -= 1.0) {
            vec4 nextNormal = texture2D(map, vUv + (normalStep * pixelSize * 2.0 * step));
            //nextNormal.a *= 0.5;

            baseNormal = combineNormals(baseNormal, nextNormal);
        }

        return baseNormal;
    }

   void main() {
        gl_FragColor = smooth();
   }
`;

export default SmoothNormalMapFragmentShader;
