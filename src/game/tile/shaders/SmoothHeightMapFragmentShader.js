const SmoothHeightMapFragmentShader = `

    #extension GL_OES_standard_derivatives : enable

    uniform sampler2D map;
    uniform float pixelSize;
    uniform float tileSize;

    varying vec2 vUv;

    float colorToHeight(vec4 color) {
        return color.r + color.g + color.b;
    }

    vec4 heightToColor(float height) {
        
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

        color.r = height > 1.0 ? 1.0 : height;
        height = height > 1.0 ? height - 1.0 : 0.0;
        color.g = height > 1.0 ? 1.0 : height;
        height = height > 1.0 ? height - 1.0 : 0.0;
        color.b = height;

        return color;
    }

    float getHeight(vec2 uv) {
        return colorToHeight(texture2D(map, uv));
    }

    float accumulate(vec2 uv, float height){
        vec2 heightUv = vUv + (uv * pixelSize);

        height += getHeight(heightUv) * 1.0;
        return height;
    } 
 
    vec4 smooth() {

        float height = getHeight(vUv);
        float rounds = 0.0;

        for (float x = -3.0; x <= 3.0; x += 1.0) {
		    for (float y = -3.0; y <= 3.0; y += 1.0) {

                rounds += 1.0;

                if (x == 0.0 && y == 0.0) {
                    continue;
                }

                height = accumulate(vUv + (vec2(x,y) * pixelSize), height);
            }
        }

        return heightToColor(height / rounds);
    }

   void main() {
        gl_FragColor = smooth();
   }
`;

export default SmoothHeightMapFragmentShader;
