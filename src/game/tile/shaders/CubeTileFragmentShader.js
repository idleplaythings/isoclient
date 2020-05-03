const CubeTileFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    uniform sampler2D map2;
    uniform sampler2D wallMap;
    uniform sampler2D wallNormalMap;
    uniform float time;
    
    uniform vec3 directionalLightPosition;
    uniform vec3 directionalLightColor;
    uniform float directionalLightIntensity;
    uniform vec3 ambientLightColor;
    uniform float ambientLightIntensity;
    

    varying vec2 vUv;
    varying float vOpacity;
    varying vec4 vTextureNumber1;
    varying vec4 vTextureNumber2;
    varying vec3 vType;
    varying float vTextureVariant;
    varying vec3 vViewPosition;
    varying vec3 vPosition;

    float isFlipped() {
        if (vType.z > 0.0) {
            return 1.0;
        } else {
            return 0.0;
        }
    }

    vec4 sampleTexture(float number, int normal) {

        if (number < 1.0) {
            return vec4(0,0,0,0);
        }

        float y = vUv.y;
        if (isFlipped() == 1.0) {
            y = 1.0 - vUv.y;
        }

        int mapNumber = 0;

       if (number > 511.0) {
            mapNumber = 2;
            number -= 511.0;
        } else if (number > 255.0) {
            mapNumber = 1;
            number -= 255.0;
        }  

        float textureAmount = 16.0;
        vec2 tPos = vec2((mod(number, textureAmount) * (1.0 / textureAmount)), (floor(number / textureAmount) * (1.0 / textureAmount)));
        vec2 finalPos = vec2((vUv.x / textureAmount + tPos.x), 1.0 - (y / textureAmount + tPos.y));

        if (vTextureVariant > 0.0) {
            finalPos += vec2(0.02587890625, 0.02099609375) * vTextureVariant;
        }

        if (normal == 1) {  
            if (mapNumber == 1) {
                return vec4(0.0);
            } else if (mapNumber == 2) {
                return texture2D( wallNormalMap, finalPos ); 
            } else {
                return vec4(0.0);
            }
        } else {
            if (mapNumber == 1) {
                return texture2D( map2, finalPos ); 
            } else if (mapNumber == 2) {
                return texture2D( wallMap, finalPos ); 
            } else {
                return texture2D( map, finalPos );
            }

        }
    }

    vec4 combineColorByAlpha(vec4 colorA, vec4 colorB) {

        if (colorA.a == 0.0) {
            return colorB;
        }

        if (colorB.a == 0.0) {
            return colorA;
        }

        float alpha = colorB.a > colorA.a ? colorB.a : colorA.a;

        vec4 finalColor = mix(colorA, colorB, colorB.a);

        finalColor.a = alpha;

        return finalColor;
    }

    vec4 combineTextureToColor(vec4 color, float textureNumber, int normal) {

        if (textureNumber < 1.0) {
            return color;
        }

        return combineColorByAlpha(color, sampleTexture(textureNumber, normal));
    }

    vec4 calculateLight(vec4 color, vec3 normal){

        normal = normal * 2.0 - 1.0;

        vec3 ambient = ambientLightIntensity * ambientLightColor;

        float diff = max(dot(normal, directionalLightPosition), 0.0);
        vec3 directional = diff * directionalLightIntensity * directionalLightColor;

        float specularStrength = 0.07;

        vec3 viewDir = normalize(vViewPosition - vPosition);
        vec3 reflectDir = reflect(-directionalLightPosition, normal);  
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 4.0);
        vec3 specular = specularStrength * spec * directionalLightColor;  

        vec3 newColor = (directional + specular + ambient) *  color.xyz;

        return vec4(newColor.xyz, color.a);
    }
    
    vec4 getColor() {

        vec4 color = sampleTexture(vTextureNumber1.r, 0);
        color = combineTextureToColor(color, vTextureNumber1.g, 0);
        color = combineTextureToColor(color, vTextureNumber1.b, 0);
        color = combineTextureToColor(color, vTextureNumber1.a, 0);

        return color;
    }

    vec4 getNormal() {
        vec4 color = sampleTexture(vTextureNumber1.r, 1);
        color = combineTextureToColor(color, vTextureNumber1.g, 1);
        color = combineTextureToColor(color, vTextureNumber1.b, 1);
        color = combineTextureToColor(color, vTextureNumber1.a, 1);

        return color;
    }

    void main() {
        if (vOpacity == 0.0) {
            discard;
        }

        vec4 color = getColor();
        vec4 normal = getNormal();
        if (normal.a != 0.0) {
            color = calculateLight(color, normal.xyz);
        }

        color.a *= vOpacity;
        
        gl_FragColor = color;
       
    }
`;

export default CubeTileFragmentShader;
