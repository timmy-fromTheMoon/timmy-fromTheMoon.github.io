import{$ as e,G as t,Nt as n,Pt as r,Q as i,T as a,X as o,Y as s,f as c,g as l,n as u,r as d}from"./simpleCharacters-DhD3EwLW.js";var f=.5,p=.125,m=1200,h={minCol:-3,maxCol:11,minRow:-3,maxRow:11};function g(e){return Number.isFinite(e.col)&&Number.isFinite(e.row)}function _(e,t,n){if(!g(e)||!g(t))return!1;let r=Math.hypot(t.col-e.col,t.row-e.row);if(r>24)return!1;let i=Math.max(1,Math.ceil(r/p));for(let r=1;r<=i;r+=1){let a=r/i,o={col:e.col+(t.col-e.col)*a,row:e.row+(t.row-e.row)*a};if(!n(o))return!1;if(r<i){let e=.05;if(!n({col:o.col-e,row:o.row})||!n({col:o.col+e,row:o.row})||!n({col:o.col,row:o.row-e})||!n({col:o.col,row:o.row+e}))return!1}}return!0}function v(e,t,n,r=h){let i=({col:e,row:t})=>e>=r.minCol&&e<=r.maxCol&&t>=r.minRow&&t<=r.maxRow,a=new Map,o=e=>{let t=`${e.col.toFixed(7)}:${e.row.toFixed(7)}`,r=a.get(t);if(r!==void 0)return r;if(a.size>=2e4)return!1;let i=n(e);return a.set(t,i),i};if(!g(e)||!g(t)||!o(t))return null;if(_(e,t,o))return[{...t}];if(!i(e))return null;let s=(e,t)=>`${e}:${t}`,c=t=>({col:e.col+t.col*f,row:e.row+t.row*f}),l=e=>Math.hypot(e.col-t.col,e.row-t.row),u=s(0,0),d=new Map([[u,{col:0,row:0,g:0,f:l(e),parent:null,closed:!1}]]),p=[u],v=[[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[-1,-1],[1,-1]],y=0;for(;p.length&&y<m;){let n=0;for(let e=1;e<p.length;e+=1)d.get(p[e]).f<d.get(p[n]).f&&(n=e);let r=p.splice(n,1)[0],a=d.get(r);if(a.closed)continue;a.closed=!0,y+=1;let u=c(a);if(l(u)<=f*1.5&&_(u,t,o)){let n=[{...t}],r=a;for(;r?.parent!=null;)n.push(c(r)),r=d.get(r.parent);n.reverse();let i=[],s=e;for(let e=0;e<n.length;){let t=n.length-1;for(;t>e&&!_(s,n[t],o);)--t;i.push(n[t]),s=n[t],e=t+1}return i}for(let[e,t]of v){let n=a.col+e,m=a.row+t,h=c({col:n,row:m});if(!i(h))continue;let g=s(n,m),v=d.get(g);if(v?.closed||!_(u,h,o))continue;let y=a.g+Math.hypot(e,t)*f;if(v&&y>=v.g)continue;let b={col:n,row:m,g:y,f:y+l(h),parent:r,closed:!1};d.set(g,b),v||p.push(g)}}return null}var y=1900,b=2850,ee=280,te=140,ne=42e-5;function x(e){return{col:e.col,row:e.row}}function S(e,t,n){return Math.min(n,Math.max(t,e))}function C(e,t){let n=t.col-e.col,r=t.row-e.row,i=(n-r)*64,a=(n+r)*32;return Math.abs(i)>Math.abs(a)?i>=0?`right`:`left`:a>=0?`front`:`back`}function re(e){return e===`front`?`left`:e===`left`?`back`:e===`back`?`right`:`front`}function w(e,t=Math.random,n={}){let r=x(e),i=`resting`,a=`front`,o=0,s=0,c=null,l=null,u=null,d=[],f=0,p=n.isLegal??(()=>!0);function m(){c=null,l=null,d=[],f=0,i=`resting`,o=0}function h(e,t){let i=v(r,e,p,n.pathBounds);return i?(c=x(e),l=t,d=i,f=0,!0):!1}function g(){let e=n.activitySpots?.()??[];if(e.length>0&&t()<.68)for(let r=0;r<Math.min(8,e.length*2);r+=1){let r=e[Math.floor(t()*e.length)%e.length],i=t()*Math.PI*2,a=.8+t()*.65,o={col:r.col+Math.cos(i)*a,row:r.row+Math.sin(i)*a};if(!n.isLegal||n.isLegal(o))return o}for(let e=0;e<12;e+=1){let e={col:S(4+(t()-.5)*4.6,1.4,6.6),row:S(4+(t()-.5)*4.2,1.5,6.5)};if(!n.isLegal||n.isLegal(e))return e}return x(r)}function w(e){if(!c&&!h(g(),`roam`)||!c||!p(c))return m();let t=ne*e,n=!1;for(;f<d.length;){let e=d[f],o=e.col-r.col,s=e.row-r.row,u=Math.hypot(o,s);if(u<1e-5){f+=1;continue}if(t<=0)break;let g=Math.min(u,t),v={col:r.col+o/u*g,row:r.row+s/u*g};if(!_(r,v,p)){if(!n&&h(c,l??`roam`)){n=!0;continue}return m()}a=C(r,v),r=v,t-=g,i=`walking`,g>=u&&(f+=1)}f>=d.length&&(l===`command`&&(u=x(r)),m())}function T(e){let t=Math.max(0,Math.min(e,5e3));switch(o+=t,i){case`resting`:n.roaming!==!1&&o>=b?(i=`choosingDestination`,o=0):n.roaming!==!1&&o>=y&&(i=`idle`,a=re(a));break;case`idle`:n.roaming!==!1&&o>=b&&(i=`choosingDestination`,o=0);break;case`choosingDestination`:w(t);break;case`walking`:w(t);break;case`held`:s=.72;break;case`falling`:{let e=Math.min(1,o/ee);s=.72*(1-e*e),e>=1&&(i=`settling`,o=0,s=0);break}case`settling`:o>=te&&(i=`resting`,o=0,u=x(r))}}function E(e){(!n.isLegal||n.isLegal(e))&&(r=x(e)),c=null,l=null,d=[],f=0,o=0,s=.72,i=`held`}function D(e){if(i!==`held`||!Number.isFinite(e.col)||!Number.isFinite(e.row))return;let t=r,n=Math.hypot(e.col-t.col,e.row-t.row);if(!n)return;let a=Math.min(n,24),o=Math.max(1,Math.ceil(a/.08));for(let i=1;i<=o;i+=1){let s=a/n*i/o,c={col:t.col+(e.col-t.col)*s,row:t.row+(e.row-t.row)*s};if(!p(c)){let e=r,t=c;for(let n=0;n<8;n+=1){let n={col:(e.col+t.col)/2,row:(e.row+t.row)/2};p(n)?e=n:t=n}r=e;return}r=c}}function O(e=!1){i===`held`&&(i=e?`resting`:`falling`,o=0,e&&(s=0,u=x(r)))}function k(e,t=`command`){return i===`held`||i===`falling`||i===`settling`||!h(e,t)?!1:(o=0,s=0,i=`walking`,!0)}function A(e){return i===`held`||i===`falling`||i===`settling`?!1:(r=x(e),c=null,l=null,d=[],f=0,o=0,s=0,i=`resting`,!0)}function j(){return{state:i,position:x(r),direction:a,lift:s}}function M(){let e=u?x(u):null;return u=null,e}return{tick:T,hold:E,moveHeld:D,release:O,walkTo:k,syncPosition:A,snapshot:j,consumeSettled:M}}var T={minZoom:.18,maxZoom:9,panRadius:60,viewDistance:180};function E(e,n,i,a,o={}){let s=new u(e,n),{minX:c,maxX:l,minZ:d,maxZ:f}=i.bounds;s.target.set(...i.camera.target),s.cursor.set((c+l)/2,s.target.y,(d+f)/2),s.maxTargetRadius=o.panRadius??Math.min(l-c,f-d)*.36,s.minPolarAngle=Math.PI/9,s.maxPolarAngle=Math.PI*.33,s.minZoom=o.minZoom??.82,s.maxZoom=o.maxZoom??3.2,o.viewDistance&&(e.position.sub(s.target).setLength(o.viewDistance).add(s.target),e.far=Math.max(e.far,o.viewDistance*2.5),e.updateProjectionMatrix()),s.screenSpacePanning=!1,s.rotateSpeed=.65,s.mouseButtons.MIDDLE=t.PAN,s.update(),e.updateMatrixWorld(),s.saveState();function p(){e.updateMatrixWorld(),a.change()}let m=new AbortController,h={signal:m.signal},g=new r,_=null;function v(e){return!_||Math.hypot(_.x-e.clientX,_.y-e.clientY)>6}return s.addEventListener(`change`,p),n.addEventListener(`pointerdown`,e=>{_=e.isPrimary&&e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey?{id:e.pointerId,x:e.clientX,y:e.clientY}:null},h),n.addEventListener(`pointermove`,e=>{_?.id===e.pointerId&&v(e)&&(_=null),e.pointerType===`mouse`&&!e.buttons&&a.hover(e)},h),n.addEventListener(`pointerup`,e=>{_?.id===e.pointerId&&!v(e)&&a.tap(e),_=null},h),n.addEventListener(`pointercancel`,()=>{_=null},h),n.addEventListener(`lostpointercapture`,()=>{_=null},h),{zoom(e){e>0?s.dollyOut(1.22):s.dollyIn(1.22)},rotate(e){s.rotateLeft(-e*Math.PI/6)},pan(e,t){s.pan(-e*32,t*32)},setPanRadius(e){!Number.isFinite(e)||e<=0||e===s.maxTargetRadius||(s.maxTargetRadius=e,s.update())},center(){s.reset()},offsetPoint(t,n,r,i){return e.getWorldDirection(g).setY(0).normalize(),{x:t.x+(r*g.x-n*g.z)*i,z:t.z+(r*g.z+n*g.x)*i}},dispose(){m.abort(),s.removeEventListener(`change`,p),s.dispose()}}}function D(e,{mapSize:t=2048,extent:n=23}={}){let r=e.shadow;(r.mapSize.x!==t||r.mapSize.y!==t)&&(r.map?.dispose(),r.map=null,r.mapSize.set(t,t));let i=Number.isFinite(n)?Math.max(8,n):23;r.camera.left=r.camera.bottom=-i,r.camera.right=r.camera.top=i,r.camera.updateProjectionMatrix();let a=i*2/t;r.radius=Math.max(.75,.034/a)/.7071,r.normalBias=Math.max(.022,a*1.55),r.bias=-15e-5,r.needsUpdate=!0}function O(e){e.traverse(t=>{if(!(t instanceof s))return;let n=!1;for(let r=t;r&&r!==e;r=r.parent)if(r.name===`Flames`){n=!0;break}let r=Array.isArray(t.material)?t.material:[t.material],i=!n&&r.some(e=>e.visible&&e.depthWrite&&e.opacity>0);t.castShadow=i,t.receiveShadow=i})}var k={sun:`#ffe0a1`,fill:`#a7c7cb`,ground:`#4d7061`,sky:`#738b85`,mist:`#668588`,sunIntensity:3.45,fillIntensity:1.16};function A({outerFog:e=!1}={}){return{campAtmosphereTime:{value:0},campNight:{value:0},campFogRadius:{value:new n(4.4,4)},campForestExtent:{value:120},campMistColor:{value:new c(`#92b3a0`)},campSunDirection:{value:new r(.6,.65,.46).normalize()},campCanopyDapple:{value:0},...e?{campForestSky:{value:new c(k.sky)}}:{}}}var j=A();function M(t){let n=Array.isArray(t.material)?t.material:[t.material],r=n.some(e=>e.name===`Alpine Grass`);if(!(!r&&t.geometry.hasAttribute(`normal`))){if(n.some(e=>e.name===`Alpine Pine`||e.name===`Alpine Stone`)&&t.geometry.index){let e=t.geometry;t.geometry=e.toNonIndexed(),e.dispose()}t.geometry.computeVertexNormals();for(let t of n)t instanceof e&&r&&(t.flatShading=!1)}}var ie=(e,t)=>`
varying vec3 vCampWorldPosition;
uniform float campAtmosphereTime;
uniform float campNight;
uniform vec2 campFogRadius;
uniform float campForestExtent;
uniform vec3 campMistColor;
${t?`uniform vec3 campForestSky;`:``}
${e?`uniform vec3 campSunDirection;
uniform float campCanopyDapple;`:``}
float campCloudNoise(vec2 p) {
  vec2 cell = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  vec2 a = cell, b = cell + vec2(1.0, 0.0), c = cell + vec2(0.0, 1.0), d = cell + 1.0;
  return mix(mix(fract(sin(dot(a, vec2(127.1, 311.7))) * 43758.5453),
                 fract(sin(dot(b, vec2(127.1, 311.7))) * 43758.5453), f.x),
             mix(fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453),
                 fract(sin(dot(d, vec2(127.1, 311.7))) * 43758.5453), f.x), f.y);
}
float campCloudLight() {
  vec2 p = (vCampWorldPosition.xz + vec2(campAtmosphereTime * 0.045, campAtmosphereTime * 0.018)) * 0.12;
  float shape = 0.72 * campCloudNoise(p) + 0.28 * campCloudNoise(p * 2.03 + 8.7);
  return 1.0 - smoothstep(0.42, 0.70, shape) * ${e?`0.24`:`0.38`} * (1.0 - campNight);
}
`,ae=(e,t)=>`
  float campRim = smoothstep(0.95, 2.6, length(vCampWorldPosition.xz / campFogRadius));
  float campLowMist = exp(-max(0.0, vCampWorldPosition.y) * 0.14);
  float campLocalMist = campRim * campLowMist * (${e?`0.055 + campNight * 0.025`:`0.18 + campNight * 0.09`});
  ${t?``:`float campFarMist = smoothstep(campForestExtent * 0.65, campForestExtent * 1.08, length(vCampWorldPosition.xz));`}
  outgoingLight = mix(outgoingLight, campMistColor, ${t?`campLocalMist`:`max(campLocalMist, campFarMist * 0.985)`});
`,oe=`
  vec2 campFogPoint = vCampWorldPosition.xz / campForestExtent;
  float campFogDepth = length(campFogPoint);
  if (campFogDepth > 0.075) {
    float campFogSwell = sin(dot(campFogPoint, vec2(19.0, 12.0))) * 0.022
      + sin(dot(campFogPoint, vec2(-8.0, 23.0))) * 0.013;
    float campFogCrown = smoothstep(0.65, 8.5, vCampWorldPosition.y);
    float campFogLayer = campFogDepth + campFogSwell - 0.055 * campFogCrown;
    float campFogBank = smoothstep(0.11, 0.37, campFogLayer) * mix(0.94, 0.59, campFogCrown) * campRim;
    float campFogHorizon = smoothstep(0.58, 0.99, campFogDepth);
    vec3 campWoodlandAir = mix(campForestSky, campMistColor, mix(0.54, 0.38, campNight));
    vec3 campFogColor = mix(campWoodlandAir, campForestSky, campFogHorizon);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, campFogColor, mix(campFogBank, 1.0, campFogHorizon));
  }
`,N=new Set([`Alpine Meadow`,`Alpine Grass`,`Alpine Stone`,`Alpine Pine`,`Alpine Blossom`]),P=`
vec3 alpineLightPalette( float light ) {
  vec3 deepShade = vec3( 0.14, 0.28, 0.34 );
  vec3 openShade = vec3( 0.34, 0.53, 0.52 );
  vec3 halfLight = vec3( 0.76, 0.91, 0.76 );
  vec3 sunlight = vec3( 1.12, 1.18, 0.87 );
  vec3 palette = mix( deepShade, openShade, clamp( ( light - 0.025 ) / 0.155, 0.0, 1.0 ) );
  palette = mix( palette, halfLight, clamp( ( light - 0.18 ) / 0.22, 0.0, 1.0 ) );
  return mix( palette, sunlight, clamp( ( light - 0.40 ) / 0.34, 0.0, 1.0 ) );
}
`,F=d.lights_fragment_begin,I=F.indexOf(`#if ( NUM_DIR_LIGHTS > 0 )`),L=F.indexOf(`#if ( NUM_RECT_AREA_LIGHTS > 0 )`),R=`RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );`,z=F.slice(I,L),B=z.replace(R,`directLight.color *= campCloudLight();
RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );`),V=F.replace(z,B),H=`
#if defined( USE_SHADOWMAP ) && defined( SHADOWMAP_TYPE_PCF ) && NUM_DIR_LIGHT_SHADOWS > 0
  float campShadowTap(highp sampler2DShadow map, vec3 coord) {
    return textureGrad(map, coord, vec2(0.0), vec2(0.0));
  }

  float campDirectionalShadow(highp sampler2DShadow map, vec2 mapSize, float intensity, float bias, float radius, vec4 projected) {
    vec3 coord = projected.xyz / projected.w;
    #ifdef USE_REVERSED_DEPTH_BUFFER
      coord.z -= bias;
    #else
      coord.z += bias;
    #endif
    if (any(lessThan(coord, vec3(0.0))) || any(greaterThan(coord, vec3(1.0)))) return 1.0;

    vec2 offset = vec2(radius * 0.7071) / mapSize;
    float center = campShadowTap(map, coord) * 4.0;
    float sides = campShadowTap(map, coord + vec3(offset.x, 0.0, 0.0))
                + campShadowTap(map, coord - vec3(offset.x, 0.0, 0.0))
                + campShadowTap(map, coord + vec3(0.0, offset.y, 0.0))
                + campShadowTap(map, coord - vec3(0.0, offset.y, 0.0));
    float corners = campShadowTap(map, coord + vec3( offset, 0.0))
                  + campShadowTap(map, coord + vec3(-offset, 0.0))
                  + campShadowTap(map, coord + vec3( offset.x, -offset.y, 0.0))
                  + campShadowTap(map, coord + vec3(-offset.x,  offset.y, 0.0));
    vec2 edge = min(coord.xy, 1.0 - coord.xy) * mapSize;
    float coverage = smoothstep(0.0, 8.0, min(edge.x, edge.y));
    return mix(1.0, (center + sides * 2.0 + corners) / 16.0, intensity * coverage);
  }
#else
  #define campDirectionalShadow getShadow
#endif
`,U=B.replace(`getShadow( directionalShadowMap`,`campDirectionalShadow( directionalShadowMap`),W=F.replace(z,U),G=e=>`
vec2 campMeadowGradient(vec2 cell) {
  vec3 hash = fract(cell.xyx * vec3(0.1031, 0.1030, 0.0973));
  hash += dot(hash, hash.yzx + 33.33);
  return fract((hash.xx + hash.yz) * hash.zy) * 2.0 - 1.0;
}

float campMeadowDetail(vec2 point) {
  float footprint = max(length(dFdx(point)), length(dFdy(point)));
  vec2 cell = floor(point);
  vec2 f = fract(point);
  vec2 blend = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 east = vec2(1.0, 0.0), north = vec2(0.0, 1.0);
  float a = dot(campMeadowGradient(cell), f);
  float b = dot(campMeadowGradient(cell + east), f - east);
  float c = dot(campMeadowGradient(cell + north), f - north);
  float d = dot(campMeadowGradient(cell + east + north), f - east - north);
  float detail = mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
  return detail * (1.0 - smoothstep(0.22, 0.58, footprint));
}

vec3 campMeadowColor(vec2 campMeadowPoint) {
  vec2 patchPoint = mat2(0.8, -0.6, 0.6, 0.8) * campMeadowPoint;
  float broad = 0.5 + campMeadowDetail(patchPoint * 0.27 + vec2(8.4, -3.9));
  float drift = 0.5 + campMeadowDetail(campMeadowPoint * vec2(0.91, 0.72) + vec2(13.7, -8.2));
  float nap = campMeadowDetail(patchPoint * vec2(3.7, 2.3) + vec2(-4.3, 7.1));
  float grain = campMeadowDetail(patchPoint * vec2(7.1, 5.2) + vec2(9.2, 17.3));
  float moss = smoothstep(0.2, 0.79, broad * 0.62 + drift * 0.38);
  vec3 turf = mix(vec3(0.092, 0.150, 0.073), vec3(0.188, 0.247, 0.104), moss);
  float litter = smoothstep(0.69, 0.9, drift) * (1.0 - moss) * 0.52;
  ${e?`
    float woods = smoothstep(campForestExtent * 0.08, campForestExtent * 0.24, length(campMeadowPoint));
    float groundcover = smoothstep(0.33, 0.68, broad * 0.74 + drift * 0.26);
    vec3 woodlandFloor = mix(vec3(0.062, 0.115, 0.062), vec3(0.149, 0.216, 0.087), groundcover);
    turf = mix(turf, woodlandFloor, woods * 0.84);
    litter = mix(litter, smoothstep(0.52, 0.77, drift) * (1.0 - groundcover) * 0.64, woods);
  `:``}
  return mix(turf, vec3(0.151, 0.123, 0.060), litter) * (1.0 + nap * 0.18 + grain * 0.095);
}
`,K=`
  #include <color_fragment>
  float campLeafLightness = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  float campLeafVariation = clamp(0.88 + campLeafLightness * 0.56, 0.94, 1.06);
  float campBladeTip = smoothstep(0.01, 0.38, vCampGrassHeight);
  float campBladeDepth = mix(0.70, 1.28, campBladeTip);
  float campDrySeed = smoothstep(0.86, 1.02, diffuseColor.r / max(diffuseColor.g, 0.0001));
  vec3 campBladeColor = campMeadowColor(vCampWorldPosition.xz) * campLeafVariation * campBladeDepth;
  campBladeColor *= mix(vec3(0.93, 1.0, 1.04), vec3(1.12, 1.04, 0.89), campBladeTip);
  diffuseColor.rgb = mix(campBladeColor, diffuseColor.rgb, campDrySeed * 0.82);
`,se=`
  #include <color_fragment>
  float campNeedles = smoothstep(0.015, 0.09, diffuseColor.g - diffuseColor.r);
  float campNeedleLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3 campEvergreen = mix(diffuseColor.rgb * vec3(0.82, 0.72, 0.82),
    campNeedleLuma * vec3(0.61, 0.84, 0.72), 0.38);
  diffuseColor.rgb = mix(diffuseColor.rgb, campEvergreen, campNeedles);
`,q=F.slice(0,I)+z.replace(R,`
    directLight.color *= campCloudLight();
    alpineBeforeSun = reflectedLight.directDiffuse;
    alpineSunlight += saturate( dot( geometryNormal, directLight.direction ) )
      * dot( directLight.color, vec3( 0.2126, 0.7152, 0.0722 ) ) * RECIPROCAL_PI;
    ${R}
    alpineSunDiffuse += reflectedLight.directDiffuse - alpineBeforeSun;
  `)+F.slice(L),ce=q.replace(`saturate( dot( geometryNormal, directLight.direction ) )`,`saturate( (
    dot( normalize( mix( geometryNormal, mat3( viewMatrix ) * vec3( 0.0, 1.0, 0.0 ), 0.72 ) ),
      directLight.direction ) + 0.18 ) / 1.18 )`);function le(e,t,n=`alpine`){let r=n===`woodland`;e.toneMapping=r?7:4,e.toneMappingExposure=r?1.02:1.12,e.shadowMap.enabled=!0,e.shadowMap.type=1,e.shadowMap.autoUpdate=!1,t.background=r?new c(k.sky):new c().setRGB(.03,.13,.18);let i=r?new l(k.sun,k.sunIntensity):new l(new c().setRGB(1,.94,.76),3.55);i.name=r?`Woodland sunlight`:`Alpine afternoon sunlight`,r?i.position.set(-9,15,10):i.position.set(-18,16.2,16.2),i.castShadow=!0,i.shadow.mapSize.set(2048,2048),i.shadow.camera.left=-23,i.shadow.camera.right=23,i.shadow.camera.top=23,i.shadow.camera.bottom=-23,i.shadow.camera.far=r?160:75,i.shadow.camera.updateProjectionMatrix(),i.shadow.normalBias=r?.014:.045,i.shadow.bias=r?-8e-5:-2e-4,i.shadow.radius=r?2.1:1.35,i.shadow.intensity=r?.92:1,r&&D(i);let o=r?new a(k.fill,k.ground,k.fillIntensity):new a(new c().setRGB(.43,.78,1),new c().setRGB(.12,.2,.16),.85);return o.name=r?`Woodland sky and grass bounce`:`Alpine sky and grass bounce`,t.add(o,i),i}var J=new WeakSet;function Y(e,t,n){let r=e.onBeforeCompile,i=JSON.stringify([t,e.customProgramCacheKey()]);e.onBeforeCompile=function(e,t){r.call(this,e,t),n(e)},e.customProgramCacheKey=()=>i}function ue(t,n=j,r=`alpine`){let a=r===`woodland`,s=a&&n.campForestSky!==void 0,c=Array.isArray(t.material)?t.material:[t.material];for(let t of c){if(!(t instanceof e||t instanceof o)||J.has(t))continue;if(t instanceof o){if(!/Air perspective/.test(t.name))continue;Y(t,a?`summit-woodland-sky-cycle-v1`:`summit-alpine-sky-cycle-v2`,e=>{Object.assign(e.uniforms,n),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float campNight;`).replace(`#include <opaque_fragment>`,`outgoingLight *= mix(vec3(1.0), vec3(${a?`0.22, 0.32, 0.47`:`0.10, 0.17, 0.26`}), campNight);\n#include <opaque_fragment>`)}),t.needsUpdate=!0,J.add(t);continue}let r=!a&&N.has(t.name),c=t.name===`Alpine Grass`,l=a&&t.name===`Alpine Meadow`,u=a&&t.name===`Alpine Pine`,d=a?l?`summit-woodland-meadow-v6`:c?`summit-woodland-grass-v6`:u?`summit-woodland-needles-v2`:`summit-woodland-material-v4`:r?c?`summit-alpine-grass-cycle-v5`:`summit-alpine-palette-cycle-v3`:`summit-camp-props-cycle-v2`;Y(t,a?`${d}-tent-shadow-v2${s?`-outer-fog-v2`:``}`:d,e=>{Object.assign(e.uniforms,n),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vCampWorldPosition;`).replace(`#include <project_vertex>`,`
          vec4 campWorldPosition = vec4(transformed, 1.0);
          #ifdef USE_BATCHING
            campWorldPosition = batchingMatrix * campWorldPosition;
          #endif
          #ifdef USE_INSTANCING
            campWorldPosition = instanceMatrix * campWorldPosition;
          #endif
          vCampWorldPosition = (modelMatrix * campWorldPosition).xyz;
          #include <project_vertex>
        `),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
`+ie(a,s)+(a&&(l||c)?G(s):``)+(r?P:``)).replace(`#include <opaque_fragment>`,ae(a,s)+`
#include <opaque_fragment>`),s&&(e.fragmentShader=e.fragmentShader.replace(`#include <tonemapping_fragment>`,`#include <tonemapping_fragment>
`+oe)),a?(e.fragmentShader=e.fragmentShader.replace(`#include <shadowmap_pars_fragment>`,`#include <shadowmap_pars_fragment>\n${H}`).replace(`#include <lights_fragment_begin>`,W),l?e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
diffuseColor.rgb = campMeadowColor(vCampWorldPosition.xz);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
normal = mat3(viewMatrix) * vec3(0.0, 1.0, 0.0);`):c?(e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute float campGrassHeight;
varying float vCampGrassHeight;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vCampGrassHeight = campGrassHeight;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vCampGrassHeight;`),e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,K).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
normal = normalize(mix(normal, mat3(viewMatrix) * vec3(0.0, 1.0, 0.0), 0.48));`)):u&&(e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,se))):e.fragmentShader=r?e.fragmentShader.replace(`#include <lights_fragment_begin>`,`
            float alpineSunlight = 0.0;
            vec3 alpineSunDiffuse = vec3( 0.0 );
            vec3 alpineBeforeSun = vec3( 0.0 );
            ${c?ce:q}
          `).replace(`vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;`,`
            vec3 alpineLocalLight = max( reflectedLight.directDiffuse - alpineSunDiffuse, vec3( 0.0 ) );
            vec3 campDayPalette = ${c?`mix( vec3( 0.36, 0.52, 0.45 ), alpineLightPalette( alpineSunlight + 0.12 ), 0.68 )`:`alpineLightPalette( alpineSunlight + 0.065 )`};
            float campLuminance = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
            vec3 campMoonBase = mix(diffuseColor.rgb, vec3(campLuminance) * vec3(0.84, 0.99, 1.17), 0.22);
            float campMoonFace = mix(0.64, 1.16, smoothstep(0.015, 0.27, alpineSunlight));
            vec3 campMoonPalette = vec3(0.22, 0.34, 0.43) * campMoonFace + reflectedLight.indirectDiffuse * 0.20;
            vec3 campWarmSpill = mix(alpineLocalLight,
              vec3(dot(alpineLocalLight, vec3(0.2126, 0.7152, 0.0722))) * vec3(1.35, 0.72, 0.29), campNight * 0.50);
            vec3 totalDiffuse = mix(diffuseColor.rgb * campDayPalette, campMoonBase * campMoonPalette, campNight) + campWarmSpill;
          `):e.fragmentShader.replace(`#include <lights_fragment_begin>`,V).replace(`vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;`,`vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + diffuseColor.rgb * vec3(0.12, 0.16, 0.21) * campNight;`)}),N.has(t.name)&&(t.roughness=1,t.metalness=0),t.needsUpdate=!0,t instanceof i&&t.vertexColors&&(t.specularIntensity=.19),J.add(t)}}var X=[`tent`,`fire`,`log`,`crate`,`bedroll`,`lantern`],de=`/assets/camp3d/`;function Z(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function Q(e){return typeof e==`number`&&Number.isFinite(e)}function $(e){return Array.isArray(e)&&e.length===3&&e.every(Q)}function fe(e){return X.some(t=>t===e)}function pe(e){return Z(e)&&Q(e.x)&&Q(e.z)&&fe(e.id)&&typeof e.label==`string`&&typeof e.movable==`boolean`&&Q(e.width)&&e.width>0&&Q(e.depth)&&e.depth>0}function me(e){if(!Z(e))throw Error(`The Camp layout is missing.`);let{camera:t,bounds:n,props:r}=e;if(!Z(t)||!$(t.position)||!$(t.target)||!Q(t.width)||t.width<=0||t.position[1]<=t.target[1]||!Z(n)||!Q(n.minX)||!Q(n.maxX)||!Q(n.minZ)||!Q(n.maxZ)||n.minX>=n.maxX||n.minZ>=n.maxZ||!Array.isArray(r)||!r.every(pe)||r.length!==X.length||new Set(r.map(e=>e.id)).size!==X.length)throw Error(`The Camp layout is invalid.`);return{camera:{position:t.position,target:t.target,width:t.width},bounds:{minX:n.minX,maxX:n.maxX,minZ:n.minZ,maxZ:n.maxZ},props:r}}export{le as a,O as c,E as d,w as f,A as i,D as l,me as n,M as o,k as r,ue as s,de as t,T as u};