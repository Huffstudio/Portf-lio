/* Seda vinho em WebGL (fundo do anel). Movimento lento; pausa fora da tela. */
(function () {
  const cv = document.getElementById('silk');
  if (!cv) return;
  const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) { cv.classList.add('silk--fallback'); return; }

  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision mediump float;
uniform vec2 R;uniform float T;uniform vec2 M;
float h(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;
  float t=T*.04;
  p+=M*.04;
  vec2 q=vec2(fbm(p*1.3+t),fbm(p*1.3-t+3.1));
  vec2 r=vec2(fbm(p*1.1+2.*q+vec2(1.7,9.2)+t*1.5),fbm(p*1.1+2.*q+vec2(8.3,2.8)-t));
  float f=fbm(p*1.2+2.4*r);
  float folds=sin((p.x*2.2+p.y*1.1+f*5.5+t*2.)*2.2);
  float sheen=pow(.5+.5*folds,6.);
  vec3 deep=vec3(.075,.025,.02);
  vec3 wine=vec3(.30,.085,.06);
  vec3 terra=vec3(.66,.31,.20);
  vec3 col=mix(deep,wine,smoothstep(.2,.85,f));
  col=mix(col,terra,sheen*.55*smoothstep(.3,.9,f));
  col+=vec3(.95,.72,.6)*pow(sheen,3.)*.18;
  float v=smoothstep(1.25,.25,length(uv-vec2(.5,.45)));
  col*=.55+.45*v;
  gl_FragColor=vec4(col,1.);
}`;
  function sh(t, s) { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.classList.add('silk--fallback'); return; }
  gl.useProgram(pr);
  const b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T'), uM = gl.getUniformLocation(pr, 'M');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)').matches;
  let visible = true, mx = 0, my = 0, sx = 0, sy = 0, t0 = performance.now();

  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5) * 0.6; // seda é suave: meia resolução basta
    const w = Math.max(1, cv.clientWidth * dpr | 0), h = Math.max(1, cv.clientHeight * dpr | 0);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
  }
  new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(cv);
  addEventListener('pointermove', e => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; }, { passive: true });

  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || window.__silkPause) return;
    size();
    sx += (mx - sx) * .03; sy += (my - sy) * .03;
    gl.uniform2f(uR, cv.width, cv.height);
    gl.uniform1f(uT, reduce.matches ? 40 : (now - t0) / 1000 + 40);
    gl.uniform2f(uM, sx, -sy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(frame);
})();
