const GroundFragmentShader = `
    #extension GL_OES_standard_derivatives : enable

    uniform sampler2D groundTexture;
    uniform sampler2D propMap;
    uniform sampler2D brushMap;

    uniform int normalMode;

    uniform float size;
    uniform int tileBorders;

    varying vec2 vUv;


    float modulo(float a, float b) {
        return a - (b * floor(a/b));
    }

    vec4 combineColors(vec4 c1, vec4 c2) {
        
        if (normalMode == 1) {
            c1 -= vec4(0.5, 0.5, 1.0, 0.0);
            c2 -= vec4(0.5, 0.5, 1.0, 0.0);
            float totalAlpha = c1.a + c2.a;

            float alpha = c1.a > c2.a ? c1.a : c2.a; 

            vec3 color = vec3(0.5, 0.5, 1.0) + (c1.xyz * (c1.a / totalAlpha)) + (c2.xyz * (c2.a / totalAlpha));
            return vec4(color.xyz, alpha);

        } else {
            float alpha = c1.a > c2.a ? c1.a : c2.a; 
            vec4 color = (c1 * (1.0 - c2.a)) + (c2 * c2.a);
            color.a = alpha;
            return color;
        }
    }

    float getTileSize() {
        float groundSize = size + 2.0;
        float groundTileSize = 1.0 / groundSize;

        return groundTileSize;
    }

    vec2 cropUv() {
        float groundTileSize = getTileSize();
        
        return vec2(
            vUv.x * (1.0 - (groundTileSize * 2.0)) + groundTileSize,
            vUv.y * (1.0 - (groundTileSize * 2.0)) + groundTileSize
        );
   
    }

    vec2 getTileUv() {
        vec2 uv = cropUv();
        float tileSize = getTileSize();

        vec2 tileUv = vec2(
            modulo(uv.x, tileSize) / tileSize,
            modulo(uv.y, tileSize) / tileSize
        );

        return tileUv;
    }

    vec4 getPropDetails(vec2 propUv) {
        vec4 propDetails = texture2D(propMap, propUv);
        return propDetails * 255.0;
    }

    vec4 sampleBrush(vec2 uv, float number){
        float textureAmount = 8.0;
        vec2 tPos = vec2((mod(number, textureAmount) * (1.0 / textureAmount)), (floor(number / textureAmount) * (1.0 / textureAmount)));
        vec2 finalPos = vec2((uv.x / textureAmount + tPos.x), 1.0 - (uv.y / textureAmount + tPos.y));

        return texture2D(brushMap, finalPos);
    }

    vec4 sampleGroundTexture(float number){
        float textureAmount = 8.0;
        vec2 tPos = vec2((mod(number, textureAmount) * (1.0 / textureAmount)), (floor(number / textureAmount) * (1.0 / textureAmount)));
        vec2 finalPos = vec2((vUv.x / textureAmount + tPos.x), 1.0 - (vUv.y / textureAmount + tPos.y));

        return texture2D(groundTexture, finalPos);
    }

    vec4 getAdjacent(float brush, vec2 xy) {
        vec2 tileUv = getTileUv();

        float x = xy.x;
        float y = xy.y;

        vec2 brushUv = tileUv / 2.0 + vec2(0.25, 0.25) - (vec2(x, y) / 2.0);
                
        if (brushUv.x > 1.0 || brushUv.x < 0.0 || brushUv.y > 1.0 || brushUv.y < 0.0) {
            return vec4(0.0);
        }

        vec4 brushColor = sampleBrush(brushUv, brush);

        return brushColor;
    }

    vec4 getCombinedTileColor()  {

        vec2 tileUv = getTileUv();
        vec2 croppedUv = cropUv();
        vec4 basePropDetails = getPropDetails(croppedUv);
        vec4 baseColor = sampleGroundTexture(basePropDetails.a);
        float tileSize = getTileSize();

    
        vec4 propDetails = vec4(0.0);

        for (float x = -1.0; x <= 1.0; x += 1.0) {
		    for (float y = -1.0; y <= 1.0; y += 1.0) {

                if (x == 0.0 && y == 0.0) {
                    continue;
                }
              
                vec4 propDetails = getPropDetails(croppedUv + (vec2(x, y) * tileSize));

                if (propDetails.a <= basePropDetails.a) {
                    continue;
                }

                vec4 brushColor = getAdjacent(propDetails.z, vec2(x,y));
       
                if (brushColor.a == 0.0) {
                    continue;
                }

                vec4 nextColor = sampleGroundTexture(propDetails.a);
                nextColor.a = brushColor.a;
                baseColor = combineColors(baseColor, nextColor);
                
            }
        }
        
        return baseColor;
    }

    vec4 getCombinedOverlayColor(vec4 currentColor) {

        vec2 tileUv = getTileUv();
        vec2 croppedUv = cropUv();
        vec4 basePropDetails = getPropDetails(croppedUv);
        float tileSize = getTileSize();

        vec4 baseBrush = sampleBrush(tileUv / 2.0 + vec2(0.25, 0.25), basePropDetails.x);
        vec4 baseColor = sampleGroundTexture(basePropDetails.y);
        baseColor.a = baseBrush.a;

       
        if (basePropDetails.y == 255.0) {
            if (normalMode == 1) {  
                baseColor = vec4(0.5, 0.5, 1.0, 0.0);
            } else {
                baseColor.a = 0.0;
            }
        }
    
        vec4 propDetails = vec4(0.0);

        for (float x = -1.0; x <= 1.0; x += 1.0) {
		    for (float y = -1.0; y <= 1.0; y += 1.0) {

                if (x == 0.0 && y == 0.0) {
                    continue;
                }
              
                vec4 propDetails = getPropDetails(croppedUv + (vec2(x, y) * tileSize));

                if (propDetails.y == 255.0 || (propDetails.y < basePropDetails.y && basePropDetails.y != 255.0)) {
                    continue;
                }

                vec4 brushColor = getAdjacent(propDetails.x, vec2(x,y));
       
                if (brushColor.a == 0.0) {
                    continue;
                }

                vec4 nextColor = sampleGroundTexture(propDetails.y);
                nextColor.a = brushColor.a;

                
                if (normalMode == 1) {
                    if (brushColor.r != 0.0) {
                        brushColor.a *= 1.0;
                        nextColor = combineColors(nextColor, brushColor);
                    } 
                } 
                

                if (baseColor.a == 0.0) {
                    baseColor = nextColor;
                } else {
                    baseColor = combineColors(baseColor, nextColor);
                }         
            }
        }
        
        if (normalMode == 1) {
            baseColor.a *= 1.0;
        }

        return combineColors(currentColor, baseColor);
    }
 
    void main() {
        vec4 tileColor = getCombinedTileColor();
        tileColor = getCombinedOverlayColor(tileColor);

        if (tileBorders == 1) {  
            vec2 uv = getTileUv();
            if (uv.x > 0.99 || uv.x < 0.01 || uv.y > 0.99 || uv.y < 0.01) {
                tileColor.a *= 0.9;
            }
        }
        
        gl_FragColor = tileColor;
    }
`;

export default GroundFragmentShader;
