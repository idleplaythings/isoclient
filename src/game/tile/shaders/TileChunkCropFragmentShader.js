const TileChunkCropFragmentShader = `

   #extension GL_OES_standard_derivatives : enable

   uniform sampler2D map;
   uniform float size;
   uniform int borders;

   varying vec2 vUv;

 
   vec2 groundUv() {

       float groundSize = size + 2.0;
       float groundTileSize = 1.0 / groundSize;

       
       return vec2(
           vUv.x * (1.0 - (groundTileSize * 2.0)) + groundTileSize,
           vUv.y * (1.0 - (groundTileSize * 2.0)) + groundTileSize
       );
  
   }

   void main() {
        vec4 finalColor =  texture2D(map, groundUv());

        if (borders == 1 && (vUv.x > 0.999 || vUv.x < 0.001 || vUv.y > 0.999 || vUv.y < 0.001)) {
            finalColor = vec4(1.0, 0.0, 0.0, 1.0);
        } else {  
            finalColor = texture2D(map, groundUv());
        }

        gl_FragColor = vec4(finalColor.rgb, 1.0);
   }
`;

export default TileChunkCropFragmentShader;
