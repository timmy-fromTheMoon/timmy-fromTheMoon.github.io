import{D as e,E as t,J as n,S as r,X as i,_ as a,c as o,kt as s,nt as c,ot as l,p as u,q as d,st as f,u as p,vt as m,w as h,y as g}from"./simpleCharacters-BqF8kLww.js";var _=[{id:`hearth`,label:`Hearth`,description:`Soft rolling flames with a full, glowing heart.`},{id:`graphic`,label:`Sculpted`,description:`Bold curled silhouettes with distinct bands of colour.`},{id:`ribbon`,label:`Brushfire`,description:`Long, sweeping brush strokes and dancing tips.`}],v=`summit_camp_flame_style_v1`,y=`hearth`;function b(e){return _.some(t=>t.id===e)?e:y}function x(){try{return b(localStorage.getItem(v))}catch{return y}}function S(e){try{localStorage.setItem(v,b(e))}catch{}}var C=16,w=5,T=Math.PI*2;function E(r){let o=r.getObjectByName(`Flames`);if(!o)return null;let s=o.userData.stage,p=typeof s==`number`&&Number.isFinite(s)?Math.min(4,Math.max(0,Math.trunc(s))):3,g=o.userData.baseY,_=o.userData.proceduralMotion===!0,v=[],y=1/0,b=-1/0;if(o.traverse(e=>{if(!(e instanceof d))return;let t=e.geometry.getAttribute(`position`);if(!t||t.isInterleavedBufferAttribute)return;let r=1/0,o=-1/0;for(let e=0;e<t.count;e+=1)r=Math.min(r,t.getY(e)),o=Math.max(o,t.getY(e));let s=typeof g==`number`&&Number.isFinite(g)?Math.max(r,g):Math.max(r,.24);y=Math.min(y,s),b=Math.max(b,o),t.setUsage(a),e.geometry.computeBoundingSphere(),e.geometry.boundingSphere&&(e.geometry.boundingSphere.radius+=(o-r)*.3),e.castShadow=!1,e.receiveShadow=!1;let c=(Array.isArray(e.material)?e.material:[e.material]).filter(e=>e instanceof i||e instanceof n).map(e=>({material:e,opacity:e.opacity,intensity:e instanceof i?e.emissiveIntensity:1})),l=(Array.isArray(e.material)?e.material:[e.material]).filter(e=>e instanceof m);v.push({position:t,rest:Float32Array.from(t.array),base:s,shaders:l,height:Math.max(.01,o-s),surfaces:c})}),!v.length)return null;let x=Math.max(.05,b-y),S=[4,6,9,12,16][p],E=[2,2,3,4,5][p],D=[.12,.2,.3,.42,.6][p],O=!1,k=new f(`#ffad67`,D,1.8+p*.56,2);k.name=`Campfire light`,k.position.set(0,y+x*.45,0);let A=new u(`#ffad67`),j=new u(`#ff641d`),M=new l(1,1),N=new m({uniforms:{poolStrength:{value:0}},transparent:!0,depthWrite:!1,toneMapped:!1,blending:2,vertexShader:`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      varying vec2 vUv; uniform float poolStrength;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        float falloff = pow(max(0.0, 1.0 - d * d), 3.0);
        gl_FragColor = vec4(vec3(1.0, 0.14, 0.018), falloff * poolStrength);
        #include <colorspace_fragment>
      }`}),P=new d(M,N);P.name=`Campfire ground glow`,P.rotation.x=-Math.PI/2,P.position.y=.004,P.scale.setScalar(.65+p*.36),P.raycast=()=>{};let F=new h(.006,0),I=new n({toneMapped:!1,transparent:!0,opacity:.86,depthWrite:!1}),L=new e(F,I,C);L.name=`Rising embers`,L.instanceMatrix.setUsage(a),L.frustumCulled=!1,L.raycast=()=>{},L.renderOrder=5;let R=new c,z=new u(`#ffd18a`),B=new u(`#ff7929`),V=new u(`#6a2410`),H=new u,U=new l(1,1),W=new t(new Float32Array(w),1);W.setUsage(a),U.setAttribute(`puffOpacity`,W);let G=new m({uniforms:{smokeTint:{value:new u(`#89968a`)}},transparent:!0,depthWrite:!1,toneMapped:!1,vertexShader:`
      attribute float puffOpacity;
      varying vec2 vPuffUv;
      varying float vPuffOpacity;
      void main() {
        vPuffUv = uv;
        vPuffOpacity = puffOpacity;
        vec4 centre = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
        vec2 scale = vec2( length( instanceMatrix[0].xyz ) * length( modelMatrix[0].xyz ),
                           length( instanceMatrix[1].xyz ) * length( modelMatrix[1].xyz ) );
        centre.xy += position.xy * scale;
        gl_Position = projectionMatrix * centre;
      }
    `,fragmentShader:`
      uniform vec3 smokeTint;
      varying vec2 vPuffUv;
      varying float vPuffOpacity;
      void main() {
        vec2 offset = vPuffUv * 2.0 - 1.0;
        float falloff = pow( max( 0.0, 1.0 - dot( offset, offset ) ), 2.0 );
        gl_FragColor = vec4( smokeTint, falloff * vPuffOpacity );
        #include <colorspace_fragment>
      }
    `}),K=new e(U,G,w);K.name=`Soft campfire smoke`,K.instanceMatrix.setUsage(a),K.frustumCulled=!1,K.raycast=()=>{},K.renderOrder=4;let q=new c;r.add(k,P,L,K);function J(e,t=!0,n=0){if(O)return;let r=t&&Number.isFinite(e)?Math.max(0,e):0,a=Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;for(let[e,n]of v.entries()){let{position:o,rest:s,height:c,surfaces:l}=n;for(let e of n.shaders)e.uniforms.flameTime&&(e.uniforms.flameTime.value=r),e.uniforms.flameNight&&(e.uniforms.flameNight.value=a);let u=e*1.83,d=t?.13*Math.sin(r*7.6+u)+.065*Math.sin(r*13.8-u):0;for(let e=0;!_&&e<o.count;e+=1){let i=e*3,a=s[i+1],l=Math.max(0,a-n.base),f=(l/c)**1.65,p=t?f*c*(.105*Math.sin(r*5.4-l*4.4+u)+.045*Math.sin(r*10.2+u)):0,m=t?f*c*.041*Math.sin(r*7.1-u):0;o.setXYZ(e,s[i]+p,a+l*d,s[i+2]+m)}_||(o.needsUpdate=!0);for(let{material:e,opacity:n,intensity:a}of l){let o=t?Math.sin(r*11.2+u):0;e instanceof i&&(e.emissiveIntensity=a*(1+o*.09)),e.transparent&&(e.opacity=n*(1+o*.025))}}let o=t?.055*Math.sin(r*7.9)+.026*Math.sin(r*14.3):0;if(k.color.copy(A).lerp(j,a),k.intensity=D*(1+o)*(1+a*.9),k.distance=(1.8+p*.56)*(1+a*.18),N.uniforms.poolStrength.value=(.025+a*.15)*(1+o),L.visible=t,K.visible=t,t){for(let e=0;e<C;e+=1){let t=r/(1.65+e%5*.23)+e*.273,n=t%1,i=e*2.4+Math.floor(t)*1.7,o=.05+n*(.11+p*.025+e%3*.018),s=e<S?Math.sin(n*Math.PI)*(.5+e%4*.13):0;R.position.set(Math.cos(i)*o+n*.1,y+x*.65+n*(.42+p*.13),Math.sin(i)*o+.035*Math.sin(n*T+i)),R.scale.set(s,s*(1.6-n*.35),s),R.updateMatrix(),L.setMatrixAt(e,R.matrix),L.setColorAt(e,H.copy(z).lerp(B,a).lerp(V,n**1.6))}L.instanceMatrix.needsUpdate=!0,L.instanceColor&&(L.instanceColor.needsUpdate=!0);for(let e=0;e<w;e+=1){let t=(r/(2.9+e*.19)+e*.21)%1,n=.07+t*(.2+p*.045);q.position.set(.04*Math.sin(e*2.4)+t*.19,y+x*.9+t*(.46+p*.12),.04*Math.cos(e*1.9)+t*.06),q.scale.set(n,n*1.45,1),q.updateMatrix(),K.setMatrixAt(e,q.matrix),W.setX(e,e<E?Math.sin(t*Math.PI)**1.6*(.105-a*.025):0)}K.instanceMatrix.needsUpdate=!0,W.needsUpdate=!0}}return J(0,!1),{update:J,dispose(){O||(O=!0,r.remove(k,P,L,K),k.dispose(),M.dispose(),N.dispose(),L.dispose(),F.dispose(),I.dispose(),K.dispose(),U.dispose(),G.dispose())}}}var D=new s;function O(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;D.copy(t),D[r]=0,D.normalize();let l=.5*o/(o+s),u=1-D.angleTo(e)/c;return Math.sign(D[n])===1?u*l:s/(o+s)+l+l*(1-u)}var k=class e extends o{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let c=new s,l=new s,u=new s(e,t,n).divideScalar(2).subScalar(i),d=this.attributes.position.array,f=this.attributes.normal.array,p=this.attributes.uv.array,m=d.length/6,h=new s,g=.5/a;for(let r=0,a=0;r<d.length;r+=3,a+=2)switch(c.fromArray(d,r),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),d[r+0]=u.x*Math.sign(c.x)+l.x*i,d[r+1]=u.y*Math.sign(c.y)+l.y*i,d[r+2]=u.z*Math.sign(c.z)+l.z*i,f[r+0]=l.x,f[r+1]=l.y,f[r+2]=l.z,Math.floor(r/m)){case 0:h.set(1,0,0),p[a+0]=O(h,l,`z`,`y`,i,n),p[a+1]=1-O(h,l,`y`,`z`,i,t);break;case 1:h.set(-1,0,0),p[a+0]=1-O(h,l,`z`,`y`,i,n),p[a+1]=1-O(h,l,`y`,`z`,i,t);break;case 2:h.set(0,1,0),p[a+0]=1-O(h,l,`x`,`z`,i,e),p[a+1]=O(h,l,`z`,`x`,i,n);break;case 3:h.set(0,-1,0),p[a+0]=1-O(h,l,`x`,`z`,i,e),p[a+1]=1-O(h,l,`z`,`x`,i,n);break;case 4:h.set(0,0,1),p[a+0]=1-O(h,l,`x`,`y`,i,e),p[a+1]=1-O(h,l,`y`,`x`,i,t);break;case 5:h.set(0,0,-1),p[a+0]=O(h,l,`x`,`y`,i,e),p[a+1]=1-O(h,l,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}},A=`
  uniform float flameNight;
  uniform vec3 flameOuterDay;
  uniform vec3 flameBodyDay;
  uniform vec3 flameCoreDay;
  uniform vec3 flameOuterNight;
  uniform vec3 flameBodyNight;
  uniform vec3 flameCoreNight;
  vec3 flameColour(float body, float core) {
    float n = clamp(flameNight, 0.0, 1.0);
    vec3 outside = mix(flameOuterDay, flameOuterNight, n);
    vec3 middle = mix(flameBodyDay, flameBodyNight, n);
    vec3 heart = mix(flameCoreDay, flameCoreNight, n);
    vec3 colour = mix(outside, middle, clamp(body, 0.0, 1.0));
    return mix(colour, heart, clamp(core, 0.0, 1.0)) * (1.0 + n * 0.16);
  }
`,j=`
  attribute float flameProgress;
  attribute float flamePhase;
  attribute float flameAcross;
  uniform float flameTime;
  uniform float flameHeight;
  uniform float flameRadius;
  varying float vHeight;
  varying float vPhase;
  varying float vAcross;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  void main() {
    vHeight = flameProgress;
    vPhase = flamePhase;
    vAcross = flameAcross;
    vUv = uv;
    vec3 p = position;
    float weight = pow(max(0.0, flameProgress), 1.3);
    float travel = flameTime * 3.7 - flameProgress * 5.4 + flamePhase;
    #if defined(FLAME_HEARTH)
      p.x += flameRadius * weight * (0.32 * sin(travel) + 0.11 * sin(travel * 1.83));
      p.y += flameHeight * flameProgress * 0.055 * sin(flameTime * 4.6 + flamePhase);
    #elif defined(FLAME_GRAPHIC)
      p.x += flameRadius * weight * 0.43 * sin(travel * 0.72);
      p.z += flameRadius * weight * 0.27 * cos(travel * 0.61);
      p.y += flameHeight * flameProgress * 0.065 * sin(flameTime * 4.1 + flamePhase);
    #else
      p.x += flameRadius * weight * 0.46 * sin(travel * 0.81);
      p.z += flameRadius * weight * 0.37 * cos(travel * 0.67);
      p.y += flameHeight * flameProgress * 0.075 * sin(flameTime * 4.4 + flamePhase);
    #endif
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vViewNormal = normalMatrix * normal;
    vViewPosition = -view.xyz;
    gl_Position = projectionMatrix * view;
  }
`,M=`
  uniform float flameTime;
  varying float vHeight;
  varying float vPhase;
  varying float vAcross;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  ${A}
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + 1.0, vec2(127.1, 311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  void main() {
    float y = vUv.y;
    float t = flameTime;
    float flowing = noise(vec2(vUv.x * 4.3 + vPhase, y * 4.8 - t * 1.6));
    float detail = noise(vec2(vUv.x * 8.0 - t * 0.3, y * 8.2 - t * 2.2 + vPhase));
    float centre = 0.12 * sin(t * 2.3 - y * 7.5 + vPhase) * y;
    float x = abs((vUv.x - 0.5) * 2.0 - centre);
    float swell = sin(pow(y, 0.64) * 3.141593) * 0.67 + (1.0 - y) * 0.29;
    float edge = swell + (flowing - 0.5) * (0.18 + y * 0.22) + (detail - 0.5) * 0.09;
    float body = 1.0 - smoothstep(edge - 0.035, edge + 0.035, x);
    float inner = 1.0 - smoothstep(edge * 0.35, edge * 0.78, x);
    float core = inner * (1.0 - smoothstep(0.18, 0.63, y + flowing * 0.08));
    float base = smoothstep(0.0, 0.025, y);
    float tip = 1.0 - smoothstep(0.91, 1.0, y);
    float facing = abs(dot(normalize(vViewNormal), normalize(vViewPosition)));
    float alpha = body * base * tip * (0.18 + 0.72 * pow(facing, 1.7));
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(flameColour(inner * 0.82, core * 0.70), alpha);
    #include <colorspace_fragment>
  }
`,N=`
  uniform float flameTime;
  varying float vHeight;
  varying float vPhase;
  varying float vAcross;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  ${A}
  void main() {
    float facing = abs(dot(normalize(vViewNormal), normalize(vViewPosition)));
    float flow = sin(vHeight * 10.0 - flameTime * 4.5 + vPhase);
    float band = smoothstep(0.33, 0.36, facing + flow * 0.055);
    float core = smoothstep(0.78, 0.81, facing) * (1.0 - smoothstep(0.20, 0.63, vHeight));
    float tip = 1.0 - smoothstep(0.91, 1.0, vHeight);
    gl_FragColor = vec4(flameColour(band * 0.89, core * 0.66), tip * 0.93);
    #include <colorspace_fragment>
  }
`,P=`
  uniform float flameTime;
  varying float vHeight;
  varying float vPhase;
  varying float vAcross;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  ${A}
  void main() {
    float flow = sin(vHeight * 19.0 - flameTime * 6.2 + vPhase);
    float brush = sin(vAcross * 15.0 + vHeight * 7.0 + vPhase) * 0.035;
    float edge = 1.0 - smoothstep(0.78 + brush, 1.0, abs(vAcross));
    float body = 1.0 - smoothstep(0.28, 0.83, abs(vAcross + 0.10 * flow));
    float streak = (1.0 - smoothstep(0.04, 0.27, abs(vAcross + 0.26)))
      * (1.0 - smoothstep(0.17, 0.72, vHeight));
    float tip = 1.0 - smoothstep(0.91, 1.0, vHeight);
    float alpha = edge * tip * smoothstep(0.0, 0.02, vHeight) * (0.78 + flow * 0.07);
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(flameColour(body * 0.93, streak * 0.62), alpha);
    #include <colorspace_fragment>
  }
`;function F(){return{positions:[],uvs:[],progress:[],across:[],phases:[],indices:[]}}function I(e,t,n,r,i,a,o,s,c){e.positions.push(t,n,r),e.progress.push(i),e.across.push(a),e.phases.push(o),e.uvs.push(s,c)}function L(e,t){let n=new p;return n.setAttribute(`position`,new g(e.positions,3)),n.setAttribute(`uv`,new g(e.uvs,2)),n.setAttribute(`flameProgress`,new g(e.progress,1)),n.setAttribute(`flamePhase`,new g(e.phases,1)),n.setAttribute(`flameAcross`,new g(e.across,1)),n.setIndex(e.indices),n.computeVertexNormals(),n.computeBoundingBox(),n.computeBoundingSphere(),n.boundingSphere&&(n.boundingSphere.radius+=t*.45),n}function R(e,t,n){return new m({name:`Fireplace · ${e} flames`,defines:{[e===`hearth`?`FLAME_HEARTH`:e===`graphic`?`FLAME_GRAPHIC`:`FLAME_RIBBON`]:1},uniforms:{flameTime:{value:0},flameNight:{value:0},flameHeight:{value:t},flameRadius:{value:n},flameOuterDay:{value:new u(`#bd350a`)},flameBodyDay:{value:new u(`#ff8516`)},flameCoreDay:{value:new u(`#ffc05a`)},flameOuterNight:{value:new u(`#df2106`)},flameBodyNight:{value:new u(`#ff5709`)},flameCoreNight:{value:new u(`#ff9421`)}},transparent:!0,depthWrite:!1,side:2,toneMapped:!1,vertexShader:j,fragmentShader:e===`hearth`?M:e===`graphic`?N:P})}function z(e,t,n,r){let i=F(),a=e*1.73;for(let e=0;e<=18;e+=1)for(let o=0;o<=14;o+=1){let s=o/14,c=e/18;I(i,(s-.5)*r*2.3,t+c*n,0,c,s*2-1,a,s,c)}for(let e=0;e<18;e+=1)for(let t=0;t<14;t+=1){let n=e*15+t,r=n+1,a=n+14+1;i.indices.push(n,r,a,r,a+1,a)}return i}function B(e,t,n,r){let i=F(),a=e*2.19,o=e*2.399963,s=e===0,c=n*(s?1:.48+e%2*.15),l=r*(s?.84:.55),u=s?0:Math.cos(o)*r*.51,d=s?0:Math.sin(o)*r*.51;for(let e=0;e<9;e+=1){let n=e/8,r=Math.max(.018,Math.sin(n**.7*Math.PI)*.75+(1-n)*.35),s=Math.sin(n*Math.PI*1.5-.35)*n*l*.92,f=u+Math.cos(o+.3)*s,p=d+Math.sin(o+.3)*s;for(let e=0;e<10;e+=1){let o=e/10*Math.PI*2;I(i,f+Math.cos(o)*l*r,t+n*c,p+Math.sin(o)*l*r*.62,n,Math.cos(o),a,e/10,n)}}for(let e=0;e<8;e+=1)for(let t=0;t<10;t+=1){let n=e*10+t,r=e*10+(t+1)%10;i.indices.push(n,n+10,r,r,n+10,r+10)}for(let e of[!1,!0]){let t=e?80:0,n=0,r=0,o=0;for(let e=0;e<10;e+=1)n+=i.positions[(t+e)*3],r+=i.positions[(t+e)*3+1],o+=i.positions[(t+e)*3+2];let s=i.positions.length/3;I(i,n/10,r/10,o/10,+!!e,0,a,.5,+!!e);for(let n=0;n<10;n+=1){let r=t+n,a=t+(n+1)%10;e?i.indices.push(s,a,r):i.indices.push(s,r,a)}}return i}function V(e,t,n,r){let i=F(),a=e*2.399963,o=n*(e===0?1:.5+e%3*.14);for(let n=0;n<16;n+=1){let s=n/15,c=a+s*2.9,l=Math.sin(s*Math.PI*1.28),u=Math.cos(c)*r*(.45-s*.11)+l*r*.35,d=Math.sin(c)*r*(.45-s*.11),f=r*Math.max(.014,Math.sin(s**.62*Math.PI)*.57+(1-s)*.21),p=c+.54;for(let n=0;n<4;n+=1){let r=n/3*2-1;I(i,u+Math.cos(p)*f*r,t+s*o+f*.13*(1-r*r),d+Math.sin(p)*f*r,s,r,e*1.83,n/3,s)}}for(let e=0;e<15;e+=1)for(let t=0;t<3;t+=1){let n=e*4+t,r=n+1,a=n+4;i.indices.push(n,r,a,r,a+1,a)}return i}function H(e){let t=b(e.style),n=Number.isFinite(e.stage)?Math.max(0,Math.min(4,Math.trunc(e.stage))):0,i=Number.isFinite(e.base)?Math.max(0,e.base):.025,a=Number.isFinite(e.height)&&e.height>0?e.height:.19,o=Number.isFinite(e.radius)&&e.radius>0?e.radius:.05,s=new r;s.name=`Flames`,Object.assign(s.userData,{stage:n,baseY:i,height:a,style:t,proceduralMotion:!0});let c=new Set,l=new Set,u=R(t,a,o);l.add(u);let f=t===`hearth`?3:t===`graphic`?[2,3,3,4,4][n]:[3,3,4,5,6][n];for(let e=0;e<f;e+=1){let n=L(t===`hearth`?z(e,i,a*(e===2?.81:1),o*(e===2?.8:1)):t===`graphic`?B(e,i,a,o):V(e,i,a,o),a),r=new d(n,u);r.name=t===`hearth`?`Rolling hearth sheet ${e+1}`:t===`graphic`?`Sculpted flame ${e+1}`:`Brush ribbon ${e+1}`,t===`hearth`&&(r.rotation.y=e*Math.PI/3),r.renderOrder=3+e,r.castShadow=!1,r.receiveShadow=!1,r.raycast=()=>{},c.add(n),s.add(r)}return{group:s,geometries:c,materials:l}}export{_ as a,S as c,y as i,k as n,b as o,E as r,x as s,H as t};