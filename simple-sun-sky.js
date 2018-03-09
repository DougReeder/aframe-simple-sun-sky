// simple-sun-sky.js - An A-Frame sky primitive using a simple (and fast) gradient away from the sun patch.
// Copyright © 2018 P. Douglas Reeder under the MIT License

const vertexShader = `
precision mediump float;

const float PI = 3.1415926535897932384626433832795;

uniform vec3 sunNormal;

varying float interp;

void main() {
  // ranges from 0 when normal & sunNormal are aligned to 1 when opposite
  interp = acos(dot(normal, sunNormal)) / PI;
       
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;


const fragmentShader = `
precision mediump float;

uniform vec3 lightColor;
uniform vec3 darkColor;
uniform vec3 sunColor;

varying float interp;


void main() {
    vec3 color = mix(lightColor, darkColor, interp);
    color = mix(sunColor, color, min((interp-0.015)*75.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
}`;


AFRAME.registerShader('simpleSunSky', {
    schema: {
        sunPosition: {type: 'vec3', default: {x:1.0, y:1.0, z:1.0}},
        lightColor: {type: 'color', default: '#87cefa'},   // light sky blue
        darkColor: {type: 'color', default: '#126aab'},   // dark sky blue
        sunColor: {type: 'color', default: '#fff7ee'}   // yellow-white
    },

    /**
     * `init` used to initialize material. Called once.
     */
    init: function (data) {
        let sunPos = new THREE.Vector3(data.sunPosition.x, data.sunPosition.y, data.sunPosition.z);
        console.log("sunPos:", sunPos, "   lightColor:", new THREE.Color(data.lightColor), "   darkColor:", new THREE.Color(data.darkColor));
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                lightColor: {value: new THREE.Color(data.lightColor)},
                darkColor: {value: new THREE.Color(data.darkColor)},
                sunNormal: {value: sunPos.normalize()},
                sunColor: {value: new THREE.Color(data.sunColor)}
            },
            vertexShader,
            fragmentShader
        });
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
    },
});


AFRAME.registerPrimitive('a-simple-sun-sky', {
    defaultComponents: {
        geometry: {
            primitive: 'sphere',
            radius: 7500,
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
        'sun-color': 'material.sunColor'
    }
});
