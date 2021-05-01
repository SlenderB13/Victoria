import { OrbitControls } from '/three.js-master/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from '/three.js-master/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/three.js-master/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/three.js-master/examples/jsm/postprocessing/ShaderPass.js';

//=======================================================

const homeVertex = `
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
`
const homeFragment = `
	uniform vec2 u_mouse;
	uniform vec2 u_res;

	uniform sampler2D u_texture;
	uniform sampler2D u_texture2;
	uniform sampler2D u_texture3;

	uniform float u_time;
	varying vec2 v_uv;

	uniform float u_progress;

	  
	  void main(){    

		vec2 uvCurrent = vec2(v_uv.x + u_progress, v_uv.y - u_progress);
		vec2 uvNext = vec2(v_uv.x - (1. - u_progress), v_uv.y + (1. - u_progress));


		vec4 imgCurrent = texture2D(u_texture, uvCurrent);
		vec4 imgNext = texture2D(u_texture2, uvNext);

		vec3 colorCurrent = imgCurrent.rgb * (1. - u_progress);
		vec3 colorNext = imgNext.rgb * u_progress;

		vec4 rgba = mix(imgCurrent, imgNext, u_progress);

		//gl_FragColor  = vec4(rgba);


		gl_FragColor  = vec4(colorCurrent + colorNext, 1.);
	  }
`

//=======================================================

const filmVertex = `
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
`
const filmFragment = `
	uniform float amount;
	uniform sampler2D tDiffuse;

	varying vec2 v_uv;
	uniform float u_time;

	float random( vec2 p )
	{
		vec2 K1 = vec2(
			23.14069263277926, // e^pi (Gelfond's constant)
			2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
	);
	return fract( cos( dot(p,K1)) * 789456.789456123);
	}

	void main() {
		vec4 color = texture2D( tDiffuse, v_uv);
		vec2 uvRandom = v_uv;
		uvRandom.y *= random(vec2(uvRandom.y,amount));
		color.rgb += random(uvRandom)*0.06;
		gl_FragColor = vec4( color );
}
`

//===============================================


// CURSOR

let cursor = document.querySelector('.cursor');
window.addEventListener('mousemove', (e)=>{
	cursor.style.top = e.pageY + 'px';
	cursor.style.left = e.pageX + 'px';
});

//EVENTOS DO MOUSE

//start btn
const shopBtn = document.querySelector('.shop-btn');
shopBtn.addEventListener('mouseover', () => {
	cursor.classList.add('cursor-hovering-btn');
})
shopBtn.addEventListener('mouseleave', () => {
	cursor.classList.remove('cursor-hovering-btn');
})
shopBtn.addEventListener('click', () => {
	gsap.to('#click-here', {opacity: 0, duration: 0.2});
	gsap.to('#scroll-down', {opacity: 1, duration: 0.3});
})
//links laterais
const linksNav = document.querySelectorAll('.side-nav div');
linksNav.forEach(item => {
	item.addEventListener('mouseover', ()=> {
		cursor.classList.add('cursor-hovering');
	});
	item.addEventListener('mouseleave', ()=> {
		cursor.classList.remove('cursor-hovering');
	});
});

//cena

const scene = new THREE.Scene();
//scene.fog = new THREE.Fog(0xffffff, 0.5, 10);
scene.background = new THREE.Color(0xff0000);
//const camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight( 0x001f4d, 0.3);
scene.add(light);



camera.position.z = 2;


//controles
//const controls = new OrbitControls(camera, renderer.domElement);

//clock
const clock = new THREE.Clock();


// CENARIO

//home

let video = document.getElementById('video');
const homeUniforms = {
	u_time: {value: 0},
	u_mouse: {value: new THREE.Vector2(0., 0.)},
	u_texture: {value: new THREE.TextureLoader().load('src/assets/modelo-fundo-preto-invertida.png')},
	u_texture2: {value: new THREE.VideoTexture(video)},
	u_texture3: {value: new THREE.VideoTexture(video2)},
	u_progress: {value: 0},
};
const homeShader = new THREE.ShaderMaterial({
	uniforms: homeUniforms,
	fragmentShader: homeFragment,
	vertexShader: homeVertex,
	side: THREE.DoubleSide,
});

//const planeGeometry = new THREE.PlaneBufferGeometry(3.5, 2)
const homeCylinder = new THREE.CylinderGeometry( 2.1, 2.1, 4, 32, 1, true, 1.57, Math.PI);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const plane = new THREE.Mesh(homeCylinder, homeShader);
scene.add(plane);



//shop

const shopUniforms = {
	u_time: {value: 0},
	u_mouse: {value: new THREE.Vector2(0., 0.)},
	u_texture: {value: new THREE.TextureLoader().load('src/assets/modelo-oculos-fundo.png')},
	u_progress: {value: 0}
};
const shopShader = new THREE.ShaderMaterial({
	uniforms: shopUniforms,
	//fragmentShader: shopFragment,
	//vertexShader: shopVertex
});

const shopGeometry = new THREE.PlaneBufferGeometry(3.5,2)
const shopMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff});
const shop = new THREE.Mesh(shopGeometry, shopShader);
scene.add(shop);
shop.position.y = -2;


/* POSSIVELMENTE UM NOVO JS
// imagens da loja

const imgGeometry = new THREE.PlaneGeometry(0.65, 0.9)
var textures = [];
var images = [];
var imgMaterial = [];

// criar laco for
for(let i = 0; i<6; i++) {
	textures[i] = new THREE.TextureLoader().load(`src/assets/img${i}.jpg`);
	imgMaterial[i] = new THREE.MeshBasicMaterial({map: textures[i]});
	images[i] = new THREE.Mesh(imgGeometry, imgMaterial[i]);
	scene.add(images[i]);
}

//adicionar +1 em cada posição y
//imagens 0 e 2 não tinham y até agora
/*
images[0].position.x = -1;
images[1].position.y = 0.2;
images[2].position.x = 1;
images[3].position.y = -2.2;
images[3].position.x = -1;
images[4].position.y = -2.2;
images[4].position.x = 1;
images[5].position.y = -2;


images[0].position.x = -1;
images[0].position.y = -1;
images[1].position.y = -1.2;
images[2].position.x = 1;
images[2].position.y = -1;
images[3].position.y = -2.2;
images[3].position.x = -1;
images[4].position.y = -2.2;
images[4].position.x = 1;
images[5].position.y = -2;
*/

// letras verticais animadas

const bannerGeometry = new THREE.PlaneBufferGeometry(1.5, 0.055)
const bannerMaterial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('src/assets/collections-font.png'), transparent: true});
const banner = new THREE.Mesh(bannerGeometry, bannerMaterial);
scene.add(banner);
banner.rotation.z = Math.PI/2;
banner.position.x = -1.5;
banner.position.y = -2.3;

const bannerGeometry2 = new THREE.PlaneBufferGeometry(1.5, 0.055)
const bannerMaterial2 = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('src/assets/collections-font.png'), transparent: true});
const banner2 = new THREE.Mesh(bannerGeometry2, bannerMaterial2);
scene.add(banner2);
banner2.rotation.z = Math.PI/2;
banner2.position.x = -1.5;
banner2.position.y = -2.3;



//animacao

anime({
	targets: banner.position,
	y: 2,
	direction: 'normal',
	duration: 30000,
	loop: true,
	easing: 'linear'
  });
  
anime({
	targets: banner2.position,
	y: 2,
	direction: 'normal',
	duration: 30000,
	delay: 15000,
	loop: true,
	easing: 'linear'
});  




//filmgrain
const composer = new EffectComposer( renderer );

const pass = new RenderPass(scene, camera);
composer.addPass(pass);


const filmUniforms = {
	tDiffuse: {value: null},
	u_time: {value: 0},
}
const filmPass = new ShaderPass({
	uniforms: filmUniforms,
	fragmentShader: filmFragment,
	vertexShader: filmVertex
});
composer.addPass(filmPass);

function animate(){

	//distUniforms.u_time.value = clock.getElapsedTime();
	camera.lookAt(scene.position);
	requestAnimationFrame(animate);
	//renderer.render(scene, camera);
	composer.render();

}
animate();



/*let tl = gsap.timeline();
$('body').on('click', ()=> {
	if($('body').hasClass('done')) {
		tl.to(homeShader.uniforms.u_progress, {value: 0, duration: 1});
	} else {
		tl.to(homeShader.uniforms.u_progress, {value: 1, duration: 1});
		$('body').addClass('done');
	}
});*/


//SCROLL

const deluxTitle = document.querySelector('#delux-title');

const btn = document.querySelector('.shop-btn');

let speed = 0;
let position = 0;
document.addEventListener('wheel', (e)=> {
	speed += e.deltaY * 0.0003;
	video.play();
});


function raf() {
	position += speed;
	speed *= 0.7;

	let i = Math.round(position);
	let dif = i - position;

	position += dif * 0.03;

	homeShader.uniforms.u_progress.value = position;
	btn.style.transform = `translate(0, ${position * 100}%)`;
	if(position > 0.7) {
		gsap.to('#delux-title', {webkitTextStrokeColor: 'black', duration: 1});
		gsap.to('#victoria-title', {opacity: 0, duration: 0.5});
		gsap.to('.side-nav', {opacity: 0, duration: 0.5});
	} if (position < 0.7) {
		gsap.to('#delux-title', {webkitTextStrokeColor: '#a9aaacff', duration: 1});
		gsap.to('#victoria-title', {opacity: 1, duration: 1});
		gsap.to('.side-nav', {opacity: 1, duration: 1});
	}

	requestAnimationFrame(raf);
}

raf();