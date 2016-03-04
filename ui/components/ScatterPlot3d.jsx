
const React = require('react')
//const THREE = require('three')

export default React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data
    }
  },
  componentDidMount() {
    this._renderThree()
  },
  componentWillUpdate() {
    //this._updateThree()
  },
  render() {
    let viewOptions = this.state.viewOptions
    let scatterClasses = 'scatter-plot-3d'
    return (
      <div className="scatter-plot-3d-container">
        <div className="view-options">
        </div>
        <div id="scatter-plot-3d" ref="scatterPlot3dElement" className={scatterClasses}>
        </div>
      </div>
    )
  },
  _nodeRadius: function() {
    var nodeRadius = 2
    if (this.state.data.reduction.length > 5000) nodeRadius = 1
    if (this.state.data.reduction.length < 500) nodeRadius = 3
    if (this.state.data.reduction.length < 50) nodeRadius = 4
    return nodeRadius
  },
  _renderThree() {
    var $scatterPlot3dElement = $(this.refs.scatterPlot3dElement)
		var container = this.refs.scatterPlot3dElement
    var margin = 40
    var width = $scatterPlot3dElement.width()
    var height = $scatterPlot3dElement.height()
    var color = this.props.color
    var camera, tick = 0,
		  scene, renderer, clock = new THREE.Clock(true),
		  controls, container, options, spawnerOptions, particleSystem;

    console.log('this', this.state)
    var dataset = this.state.data

  	init();
  	animate();

  	function init() {

  		camera = new THREE.PerspectiveCamera(28, width / height, 1, 10000);
  		camera.position.z = 100;

  		scene = new THREE.Scene();

  		// The GPU Particle system extends THREE.Object3D, and so you can use it
  		// as you would any other scene graph component.	Particle positions will be
  		// relative to the position of the particle system, but you will probably only need one
  		// system for your whole scene
  		particleSystem = new THREE.GPUParticleSystem({
  			maxParticles: 250000
  		});
  		scene.add( particleSystem);

      window.particleSystem = particleSystem

  		// options passed during each spawned
  		options = {
  			//position: new THREE.Vector3(),
  			positionRandomness: 0,
  			//velocity: new THREE.Vector3(),
  			velocityRandomness: 0,
  			color: 0xaa88ff,
  			colorRandomness: 0,
  			turbulence: 0,
  			lifetime: 100,
  			size: 5,
  			sizeRandomness: 0
  		};

      var expansion = 10000

      for (var i=0; dataset.reduction.length>i; i++) {
        var point = dataset.reduction[i];
        console.log('point', point)
        var baseOptions = JSON.parse(JSON.stringify(options))
        baseOptions.position = new THREE.Vector3()
        baseOptions.velocity = new THREE.Vector3()
        baseOptions.position.x = point[0] * expansion
        baseOptions.position.y = point[1] * expansion
        baseOptions.position.z = point[2] * expansion
        //baseOptions.color = parseInt(color(dataset.clusters[i]), 16)
        //baseOptions.color = 0xffffff
        particleSystem.spawnParticle(baseOptions);
      }
/*
      for (var i=0; dataset.reduction.length>i; i++) {
        var point = dataset.reduction[i];
        var baseOptions = JSON.parse(JSON.stringify(options))
        //baseOptions.position = new THREE.Vector3(point[0], point[1], 100)
        baseOptions.position = new THREE.Vector3(Math.random() * 100, Math.random() * 100, 100)
        baseOptions.color = color(dataset.clusters[i])
        particleSystem.spawnParticle(baseOptions);
      }*/

  		spawnerOptions = {
  			spawnRate: 2000,
  			horizontalSpeed: 1.5,
  			verticalSpeed: 1.33,
  			timeScale: 0.5
  		}

  		renderer = new THREE.WebGLRenderer();
  		renderer.setPixelRatio(window.devicePixelRatio);
  		renderer.setSize(width, height);
  		container.appendChild(renderer.domElement);

  		// setup controls
  		controls = new THREE.TrackballControls(camera, renderer.domElement);
  		controls.rotateSpeed = 5.0;
  		controls.zoomSpeed = 2.2;
  		controls.panSpeed = 1;
  		controls.dynamicDampingFactor = 0.3;

  		window.addEventListener('resize', onWindowResize, false);

  	}

  	function onWindowResize() {

  		camera.aspect = width / height;
  		camera.updateProjectionMatrix();

  		renderer.setSize(width, height);

  	}

  	function animate() {

  		requestAnimationFrame(animate);

  		controls.update();

  		var delta = clock.getDelta() * spawnerOptions.timeScale;
  		tick += delta;

  		if (tick < 0) tick = 0;

  		if (delta > 0) {
  			//options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20;
  			//options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
  			//options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;

  			for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
  				// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
  				// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
  				//particleSystem.spawnParticle(options);
  			}
  		}

  		particleSystem.update(tick);

  		render();

  	}

  	function render() {

  		renderer.render(scene, camera);

  	}
  },
  _renderThree2() {
    var $scatterPlot3dElement = $(this.refs.scatterPlot3dElement)
		var container = this.refs.scatterPlot3dElement
    var margin = 40
    var width = $scatterPlot3dElement.width()
    var height = $scatterPlot3dElement.height()
    var color = this.props.color

    var renderer, scene, camera, stats;

		var particles, uniforms;

		var PARTICLE_SIZE = 20;

		var raycaster, intersects;
		var mouse, INTERSECTED;

		init();
		animate();

		function init() {
			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
			camera.position.z = 250;

			var geometry1 = new THREE.BoxGeometry( 200, 200, 200, 16, 16, 16 );
			var vertices = geometry1.vertices;

			var positions = new Float32Array( vertices.length * 3 );
			var colors = new Float32Array( vertices.length * 3 );
			var sizes = new Float32Array( vertices.length );

			var vertex;
			var color = new THREE.Color();

			for ( var i = 0, l = vertices.length; i < l; i ++ ) {

				vertex = vertices[ i ];
				vertex.toArray( positions, i * 3 );

				color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 )
				color.toArray( colors, i * 3 );

				sizes[ i ] = PARTICLE_SIZE * 0.5;

			}

			var geometry = new THREE.BufferGeometry();
			geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
			geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

			var material = new THREE.ShaderMaterial( {
				uniforms: {
					color:   { type: "c", value: new THREE.Color( 0xffffff ) },
					texture: { type: "t", value: new THREE.TextureLoader().load( "textures/sprites/disc.png" ) }
				},
				vertexShader: document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
				alphaTest: 0.9
			} );

			particles = new THREE.Points( geometry, material );
			scene.add( particles );

			renderer = new THREE.WebGLRenderer({autoSize: true, antialiasing: true});
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( width, height );
      var windowAspectRatio = width/height
      container.appendChild( renderer.domElement );

			raycaster = new THREE.Raycaster();
			mouse = new THREE.Vector2();
		}

		function animate() {
			requestAnimationFrame( animate );
			render();
		}

		function render() {

			particles.rotation.x += 0.0005;
			particles.rotation.y += 0.001;

			var geometry = particles.geometry;
			var attributes = geometry.attributes;

			raycaster.setFromCamera( mouse, camera );

			intersects = raycaster.intersectObject( particles );

			if ( intersects.length > 0 ) {

				if ( INTERSECTED != intersects[ 0 ].index ) {

					attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;

					INTERSECTED = intersects[ 0 ].index;

					attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE * 1.25;
					attributes.size.needsUpdate = true;

				}

			} else if ( INTERSECTED !== null ) {

				attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
				attributes.size.needsUpdate = true;
				INTERSECTED = null;

			}

			renderer.render( scene, camera );

		}
  }
});
