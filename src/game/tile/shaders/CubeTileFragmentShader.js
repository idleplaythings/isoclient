const CubeTileFragmentShader = `
    precision highp float;
    uniform sampler2D map;
    uniform float time;
    varying vec2 vUv;
    varying float vOpacity;
    varying vec4 vTextureNumber1;
    varying vec4 vTextureNumber2;
    varying vec3 vType;
    varying vec4 vPosition;

        
    vec4 mod289(vec4 x)
    {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x)
    {
        return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
        return 1.79284291400159 - 0.85373472095314 * r;
    }

    vec2 fade(vec2 t) {
        return t*t*t*(t*(t*6.0-15.0)+10.0);
    }

    // Classic Perlin noise
    float cnoise(vec2 P)
    {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod289(Pi); // To avoid truncation effects in permutation
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;

        vec4 i = permute(permute(ix) + iy);

        vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
        vec4 gy = abs(gx) - 0.5 ;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;

        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);

        vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
        g00 *= norm.x;  
        g01 *= norm.y;  
        g10 *= norm.z;  
        g11 *= norm.w;  

        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));

        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 2.3 * n_xy;
    }

    // Classic Perlin noise, periodic variant
    float pnoise(vec2 P, vec2 rep)
    {
        vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
        vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
        Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
        Pi = mod289(Pi);        // To avoid truncation effects in permutation
        vec4 ix = Pi.xzxz;
        vec4 iy = Pi.yyww;
        vec4 fx = Pf.xzxz;
        vec4 fy = Pf.yyww;

        vec4 i = permute(permute(ix) + iy);

        vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
        vec4 gy = abs(gx) - 0.5 ;
        vec4 tx = floor(gx + 0.5);
        gx = gx - tx;

        vec2 g00 = vec2(gx.x,gy.x);
        vec2 g10 = vec2(gx.y,gy.y);
        vec2 g01 = vec2(gx.z,gy.z);
        vec2 g11 = vec2(gx.w,gy.w);

        vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
        g00 *= norm.x;  
        g01 *= norm.y;  
        g10 *= norm.z;  
        g11 *= norm.w;  

        float n00 = dot(g00, vec2(fx.x, fy.x));
        float n10 = dot(g10, vec2(fx.y, fy.y));
        float n01 = dot(g01, vec2(fx.z, fy.z));
        float n11 = dot(g11, vec2(fx.w, fy.w));

        vec2 fade_xy = fade(Pf.xy);
        vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
        float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
        return 2.3 * n_xy;
    }

    float fbm(vec2 pos, float persistence) 
    {
        float total = 0., frequency = 1., amplitude = 1., maxValue = 0.;
        for(int i = 0; i < 4; ++i) 
        {
            total += cnoise(pos * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2.;
        }
        return total / maxValue;
    }


    float isFlipped() {
        if (vType.z > 0.0) {
            return 1.0;
        } else {
            return 0.0;
        }
    }

    vec4 sampleTexture(float number) {

        if (number < 1.0) {
            return vec4(0,0,0,0);
        }
        
        float y = vUv.y;
        if (isFlipped() == 1.0) {
            y = 1.0 - vUv.y;
        }

        float textureAmount = 16.0;
        vec2 tPos = vec2((mod(number, textureAmount) * (1.0 / textureAmount)), (floor(number / textureAmount) * (1.0 / textureAmount)));
        vec2 finalPos = vec2((vUv.x / textureAmount + tPos.x), 1.0 - (y / textureAmount + tPos.y));

        return texture2D( map, finalPos );
    }

    vec4 sampleGuide(float number, float guideColor) {
        vec4 color = sampleTexture(number);
        color.rgb *= guideColor;
        return color;
    }

    vec4 combineColorByAlpha(vec4 colorA, vec4 colorB) {

        if (colorA.a == 0.0) {
            return colorB;
        }

        if (colorB.a == 0.0) {
            return colorA;
        }

        vec4 finalColor = mix(colorA, colorB, colorB.a);

        return finalColor;
    }

    vec4 combineTextureToColor(vec4 color, float textureNumber) {

        if (textureNumber < 1.0) {
            return color;
        }

        return combineColorByAlpha(color, sampleTexture(textureNumber));
    }

    vec4 combineTextureToColorWithBrush(vec4 color, float brushNumber, float textureNumber){

        if (textureNumber < 1.0 || brushNumber < 1.0) {
            return color;
        }

        vec4 textureColor = sampleTexture(textureNumber);
        float brushAlpha = sampleTexture(brushNumber).a;
        textureColor.a -= 1.0 - brushAlpha;

        if (textureColor.a <= 0.0) {
            return color;
        }

        return combineColorByAlpha(color, textureColor);
    }

    vec4 applyShadowAndHighligh(vec4 color, float highlightTextureNumber) {

        if (highlightTextureNumber < 0.0) {
            return color;
        }

        vec4 guideColor = sampleTexture(highlightTextureNumber);

        if (guideColor.r > 0.0) {
            vec4 shadowColor = vec4(0.0, 0.0, 0.0, 1);

            color.rgb -= (shadowColor.rgb + 1.0) * guideColor.r * guideColor.a * 0.1;
            //color.rgb *= (shadowColor.rgb + 1.0) * (1.0 - guideColor.r * guideColor.a * 0.5);
        }

        if (guideColor.b > 0.0) {
            //vec4 lightColor = vec4(1, 0.83, 0.56, 1);
            
            vec4 lightColor = vec4(1, 1, 1, 1);
            color.rgb += lightColor.rgb * guideColor.b * guideColor.a * 0.1;
            //color.rgb *= lightColor.rgb * guideColor.b * guideColor.a * 1.1;
        }
        
    
        return color;
        
    }

    vec4 applyMask(vec4 color, float textureNumber) {

        if (textureNumber < 1.0) {
            return color;
        }

        float maskAlpha = sampleTexture(textureNumber).a;

        color.a *= 1.0 - maskAlpha;
        return color;
    }
    
    vec4 handleNormal() {

        vec4 color = sampleTexture(vTextureNumber1.r);
        color = combineTextureToColor(color, vTextureNumber1.g);
        color = combineTextureToColor(color, vTextureNumber1.b);
        color = combineTextureToColor(color, vTextureNumber1.a);

        return color;
    }

    vec4 handleBrushed() {
        vec4 color = combineTextureToColorWithBrush(vec4(0.0), vTextureNumber2.x, vTextureNumber1.x);
        color = combineTextureToColorWithBrush(color, vTextureNumber2.y, vTextureNumber1.y);
        color = applyShadowAndHighligh(color, vTextureNumber2.a);
     
        return color;
    }

    vec4 handleSlope() {
        vec4 color = combineTextureToColorWithBrush(vec4(0.0), vTextureNumber2.x, vTextureNumber1.x);
        color = combineTextureToColorWithBrush(color, vTextureNumber2.y, vTextureNumber1.y);
        color = applyShadowAndHighligh(color, vTextureNumber2.a);
        color = applyMask(color, vTextureNumber1.b);
        color = applyMask(color, vTextureNumber1.a);
     
        return color;
    }

    vec4 handleWater() {

        float noise = 1.0 * (fbm(vPosition.xy * 1.0, 6.0) + fbm(vPosition.xy * 2.0 + time, 6.0));

        vec4 waterColor = vec4(0.0, 0.517, 0.839, 0.2);
        vec4 higlightColor = vec4(1.0, 1.0, 1.0, 0.0);

        if (noise < 0.1) {
            return waterColor;
        }

        higlightColor.a = noise + 1.0;

        float extraAlpha = 0.0;

        if (higlightColor.a > 1.99) {
            extraAlpha = (higlightColor.a - 1.9) * 1.0;
            higlightColor.a = (higlightColor.a - 0.9) * 10.0;
        } else if (higlightColor.a > 1.4) {
            higlightColor.a = clamp((higlightColor.a - 1.4) * 2.0, 0.0, 0.3);
        } else {
            higlightColor.a = 0.0;
        }

        waterColor.rgb += higlightColor.rgb * higlightColor.a;

        //waterColor = combineColorByAlpha(waterColor, higlightColor); 
        
        waterColor.a += extraAlpha;
        
        
        
        return waterColor;
    }

    void main() {
        if (vOpacity < 1.0) {
            discard;
        }

        if (vType.x >= 1.0 && vType.x < 2.0) {
            gl_FragColor = handleBrushed();
        } else if (vType.x >= 2.0 && vType.x < 3.0) {
            gl_FragColor = handleSlope();
        } else if (vType.x >= 3.0 && vType.x < 4.0) {
            gl_FragColor = handleWater();
        } else {
            gl_FragColor = handleNormal();
        }
    }
`;

export default CubeTileFragmentShader;
