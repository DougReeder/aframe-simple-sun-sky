// simple-sun-sky.js - An A-Frame sky primitive using a simple (and fast) gradient away from the sun.
// Copyright © 2018-2019 P. Douglas Reeder under the MIT License

AFRAME.registerShader('simpleSunSky', {
    schema: {
        sunPosition: {type: 'vec3', default: {x:1.0, y:1.0, z:1.0}},
        lightColor: {type: 'color', default: '#87cefa'},   // light sky blue
        darkColor: {type: 'color', default: '#126aab'},   // dark sky blue
        fogColor: {type: 'color', default: '#4c9cd2'},   // light+dark+gray
        sunColor: {type: 'color', default: '#fff7ee'},   // yellow-white
        log: {type: 'boolean', default: false}
    },

    vertexShader: `
precision mediump float;

varying vec3 vnorm;

void main() {
    vnorm = normal;
       
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,

    fragmentShader: `
precision mediump float;

const float PI = 3.1415926535897932384626433832795;

uniform vec3 sunNormal;
uniform vec3 lightColor;
uniform vec3 darkColor;
uniform vec3 sunColor;

varying vec3 vnorm;


void main() {
    vec3 norm = normalize(vnorm);
    // ranges from 0 when normal & sunNormal are aligned to 1 when opposite
    float interp = acos(dot(norm, sunNormal)) / PI;

    vec3 color = mix(lightColor, darkColor, interp);
    color = mix(sunColor, color, min((interp-0.015)*75.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
}`,

    fragmentShaderWithFog: `
precision mediump float;

const float PI = 3.1415926535897932384626433832795;

uniform vec3 sunNormal;
uniform vec3 lightColor;
uniform vec3 darkColor;
uniform vec3 fogColor;
uniform vec3 sunColor;

varying vec3 vnorm;


void main() {
    vec3 norm = normalize(vnorm);
    // ranges from 0 when normal & sunNormal are aligned to 1 when opposite
    float interp = acos(dot(norm, sunNormal)) / PI;

    vec3 color = mix(lightColor, darkColor, interp);
    
    color = mix(sunColor, color, smoothstep(0.009, 0.012, interp));

    color = mix(fogColor, color, smoothstep(0.0, 0.3, norm.y));

    gl_FragColor = vec4(color, 1.0);
}`,

    /**
     * `init` used to initialize material. Called once.
     */
    init: function (data) {
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        if (data.fogColor.toUpperCase() === 'NONE') {
            if (data.log) {
                console.log("sunPos:", sunPos, "   lightColor:", new THREE.Color(data.lightColor), "   darkColor:", new THREE.Color(data.darkColor));
            }
            this.material = new THREE.ShaderMaterial({
                uniforms: {
                    lightColor: {value: new THREE.Color(data.lightColor)},
                    darkColor: {value: new THREE.Color(data.darkColor)},
                    sunNormal: {value: sunPos.normalize()},
                    sunColor: {value: new THREE.Color(data.sunColor)}
                },
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader
            });
        } else {
            if (data.log) {
                console.log("sunPos:", sunPos, "   lightColor:", new THREE.Color(data.lightColor), "   darkColor:", new THREE.Color(data.darkColor),
                    "   fogColor:", new THREE.Color(data.fogColor));
            }
            this.material = new THREE.ShaderMaterial({
                uniforms: {
                    lightColor: {value: new THREE.Color(data.lightColor)},
                    darkColor: {value: new THREE.Color(data.darkColor)},
                    sunNormal: {value: sunPos.normalize()},
                    sunColor: {value: new THREE.Color(data.sunColor)},
                    fogColor: {value: new THREE.Color(data.fogColor)}
                },
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShaderWithFog
            });
        }
    },
    /**
     * `update` used to update the material. Called on initialization and when data updates.
     */
    update: function (data) {
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        this.material.uniforms.sunNormal.value = sunPos.normalize();
        // this.material.uniforms.sunNormal.value.set(sunPos.normalize());

        this.material.uniforms.lightColor.value.set(data.lightColor);
        this.material.uniforms.darkColor.value.set(data.darkColor);
        this.material.uniforms.sunColor.value.set(data.sunColor);
        if (this.material.uniforms.fogColor) {
            this.material.uniforms.fogColor.value.set(data.fogColor);
        }
    },
});


AFRAME.registerPrimitive('a-simple-sun-sky', {
    defaultComponents: {
        geometry: {
            primitive: 'sphere',
            radius: 5000,
            segmentsWidth: 64,
            segmentsHeight: 20
        },
        material: {
            shader: 'simpleSunSky',
            side: 'back'
        }
    },

    mappings: {
        'sun-position': 'material.sunPosition',
        'light-color': 'material.lightColor',
        'dark-color': 'material.darkColor',
        'sun-color': 'material.sunColor',
        'fog-color': 'material.fogColor',
        'log': 'material.log',
        'radius': 'geometry.radius'
    }
});
