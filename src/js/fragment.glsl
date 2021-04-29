uniform vec2 u_mouse;
	uniform vec2 u_res;
	uniform sampler2D t_Diffuse;
	uniform float u_time;
	varying vec2 v_uv;

	float random (vec2 st) {
		const float a = 12.9898;
		const float b = 78.233;
		const float c = 43758.543123;
		return fract(sin(dot(st, vec2(a, b))) * c);
	  }
	  
	  void main(){    
		vec3 color = random(v_uv)*vec3(0.1, 0.1, 0.1);
		  gl_FragColor  = vec4(color, 1.0);
	  }