varying vec3 v_position;
	varying vec2 v_uv;
	uniform float u_progress;
	uniform float u_direction;
	uniform float u_time;


	void main() {
		vec3 pos = position;
		v_uv = uv;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	}