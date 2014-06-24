//Matt Huntington
$(function(){
	function debugAxes(parent){
		var xLineGeometry = new THREE.Geometry();
		var xLineMat = new THREE.LineBasicMaterial({color: 0xff0000, lineWidth: 5});
		xLineGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(1,0,0)), new THREE.Vertex(new THREE.Vector3(0,0,0)));
		var x_line = new THREE.Line(xLineGeometry, xLineMat);

		var yLineGeometry = new THREE.Geometry();
		var yLineMat = new THREE.LineBasicMaterial({color: 0x00ff00, lineWidth: 5});
		yLineGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0,1,0)), new THREE.Vertex(new THREE.Vector3(0,0,0)));
		var y_line = new THREE.Line(yLineGeometry, yLineMat);

		var zLineGeometry = new THREE.Geometry();
		var zLineMat = new THREE.LineBasicMaterial({color: 0x0000ff, lineWidth: 5});
		zLineGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0,0,1)), new THREE.Vertex(new THREE.Vector3(0,0,0)));
		var z_line = new THREE.Line(zLineGeometry, zLineMat);

		parent.add(x_line);
		parent.add(y_line);
		parent.add(z_line);
	}
	// Create the Three.js renderer, add it to our div 
	var container = document.getElementById("container");
	var renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled = true;
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setClearColor(0x0000cc, 1);
	container.appendChild( renderer.domElement );
	var scene = new THREE.Scene();

	// Create a camera and add it to the scene
	var camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 );
	camera.position.set( 0, 7, 7 );
	camera.rotation.x = Math.PI * -1 / 4;
	scene.add( camera );

	// Orthographic camera
	var ortho_camera = new THREE.OrthographicCamera(
					10 / -2,   // Left
					10 / 2,    // Right
					10 / 2,   // Top
					10 / -2,  // Bottom
					0,            // Near clipping plane
					1000 );           // Far clipping plane
	ortho_camera.position.set(0,7,0);
	//ortho_camera.position.set(0,0,7);
	ortho_camera.rotation.x = -1 * Math.PI/2;
	scene.add(ortho_camera);

	// Create Light
	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 5, 5, 5 );
	spotLight.castShadow = true;
	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;
	spotLight.shadowCameraNear = 1;
	spotLight.shadowCameraFar = 15;
	spotLight.shadowCameraFov = 60;
	scene.add( spotLight );

	//Create Grass
	var grass_material = new THREE.MeshPhongMaterial( {
				ambient: 0x00dd00, 
				color: 0x00cc00, 
				specular: 0x009900, 
				shininess: 30, 
				shading: THREE.FlatShading } );
	var radius = 5;
	var segments = 32;
	var circleGeometry = new THREE.CircleGeometry( radius, segments );				
	var circle = new THREE.Mesh( circleGeometry, grass_material );
	circle.rotation.x = -1 * Math.PI / 2;
	circle.castShadow = true;
	circle.receiveShadow = true;
	scene.add( circle );

	//Create Ball
	var ball_container = new THREE.Object3D();
	var ball_geometry = new THREE.SphereGeometry(0.3,32,32);
	var ball_material = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('img/BasketballColor.jpg'),shininess:15});
	var ball = new THREE.Mesh(ball_geometry, ball_material);
	ball.position.set(0,0.3,2);
	ball.castShadow = true;
	ball.receiveShadow = true;
	ball_container.add(ball);
	ball_container.rotation.y = 1.75 * Math.PI;
	scene.add(ball_container);

	// Create Robot
	var robot_group = new THREE.Object3D();
	var base_geometry = new THREE.CubeGeometry( 1, 0.5, 1 );
	var metal_material = new THREE.MeshPhongMaterial( {
				ambient: 0x030303, 
				color: 0xdddddd, 
				specular: 0x999999, 
				shininess: 30, 
				shading: THREE.FlatShading } );
	var cube = new THREE.Mesh( base_geometry, metal_material );
	cube.position.set( 0, 0.7, 2);
	cube.castShadow = true;
	cube.receiveShadow = true;
	
	// Wheels
	var wheel_geometry = new THREE.TorusGeometry(0.3, 0.15, 20, 100);
	var wheel_material = new THREE.MeshLambertMaterial({ambient:0x222222, color:0x555555});
	var wheel1 = new THREE.Mesh( wheel_geometry, wheel_material );
	wheel1.position.set(0.5,-0.3,0.65);
	wheel1.castShadow = true;
	wheel1.receiveShadow = true;
	var wheel2 = new THREE.Mesh( wheel_geometry, wheel_material );
	wheel2.position.set(-0.5,-0.3,0.65);
	wheel2.castShadow = true;
	wheel2.receiveShadow = true;
	var wheel3 = new THREE.Mesh( wheel_geometry, wheel_material );
	wheel3.position.set(0.5,-0.3,-0.65);
	wheel3.castShadow = true;
	wheel3.receiveShadow = true;
	var wheel4 = new THREE.Mesh( wheel_geometry, wheel_material );
	wheel4.position.set(-0.5,-0.3,-0.65);
	wheel4.castShadow = true;
	wheel4.receiveShadow = true;
	cube.add(wheel1);
	cube.add(wheel2);
	cube.add(wheel3);
	cube.add(wheel4);

	// Arm
	var arm_up_angle = Math.PI / -4;
	var arm_down_angle = Math.PI / -2.5;
	var shoulder_geometry = new THREE.SphereGeometry(0.25,32,32);
	var shoulder = new THREE.Mesh(shoulder_geometry, metal_material);
	shoulder.castShadow = true;
	shoulder.receiveShadow = true;
	var arm_geometry = new THREE.CylinderGeometry( 0.1, 0.1, 1, 32 );
	var arm = new THREE.Mesh( arm_geometry, metal_material );
	arm.castShadow = true;
	arm.receiveShadow = true;
	shoulder.position.set(0,0.25,0);
	shoulder.rotation.z = arm_up_angle;
	arm.position.set(0,0.5,0);
	var elbow_geometry = new THREE.SphereGeometry(0.15,32,32);
	var elbow = new THREE.Mesh(elbow_geometry, metal_material);
	elbow.position.set(0,0.5,0);
	elbow.castShadow = true;
	elbow.receiveShadow = true;
	elbow.rotation.z = Math.PI / -4;
	arm.add(elbow);
	var forearm = new THREE.Mesh(arm_geometry, metal_material);
	forearm.castShadow = true;
	forearm.receiveShadow = true;
	forearm.position.set(0,0.5,0);
	var wrist = new THREE.Mesh(elbow_geometry, metal_material);
	wrist.castShadow = true;
	wrist.receiveShadow = true;
	wrist.position.set(0,0.5,0);
	wrist.rotation.z = -7 * Math.PI/20;
	var finger_geometry = new THREE.TorusGeometry(0.5/Math.PI, 0.05, 20, 100, Math.PI);

	//Finger1
	var knuckle1 = new THREE.Object3D();
	var finger1 = new THREE.Mesh( finger_geometry, metal_material );
	finger1.castShadow = true;
	finger1.receiveShadow = true;
	finger1.rotation.z = Math.PI/-2;
	finger1.position.set(0,0.5/Math.PI,0);
	knuckle1.add(finger1);
	knuckle1.position.set(0,0.075,0);
	knuckle1.rotation.z = Math.PI / -4;
	knuckle1.rotation.y = Math.PI;
	wrist.add(knuckle1);

	//Finger2
	var knuckle2 = new THREE.Object3D();
	var finger2 = new THREE.Mesh( finger_geometry, metal_material );
	finger2.castShadow = true;
	finger2.receiveShadow = true;
	finger2.rotation.z = Math.PI/-2;
	finger2.position.set(0,0.5/Math.PI,0);
	knuckle2.add(finger2);
	knuckle2.position.set(0,0.075,0);
	knuckle2.rotation.z = Math.PI / -4;
	knuckle2.rotation.y = Math.PI / -3;
	wrist.add(knuckle2);

	//Finger3
	var knuckle3 = new THREE.Object3D();
	var finger3 = new THREE.Mesh( finger_geometry, metal_material );
	finger3.castShadow = true;
	finger3.receiveShadow = true;
	finger3.rotation.z = Math.PI/-2;
	finger3.position.set(0,0.5/Math.PI,0);
	knuckle3.add(finger3);
	knuckle3.position.set(0,0.075,0);
	knuckle3.rotation.z = Math.PI / -4;
	knuckle3.rotation.y = Math.PI / 3;
	wrist.add(knuckle3);

	forearm.add(wrist);
	elbow.add(forearm);
	shoulder.add(arm);
	cube.add(shoulder);
	robot_group.add(cube);
	scene.add( robot_group );

	var test_cube = new THREE.Mesh(base_geometry, grass_material);
	test_cube.position.set(0,-0.25,0);
	test_cube.scale.set(5,1,1);
	//scene.add(test_cube);

	// Render it
	var angle_between_robot_and_ball;
	var angle_between_tangent_and_line_to_ball;
	var robot_stopping_point;
	function calculateAngles(){
		angle_between_robot_and_ball = (2 * Math.asin(((Math.cos(Math.PI/10)+Math.sin(7*Math.PI/20))/2)/2));
		angle_between_tangent_and_line_to_ball = Math.PI/2 - (Math.PI-Math.PI/2-angle_between_robot_and_ball/2);
		robot_stopping_point = ball_container.rotation.y - angle_between_robot_and_ball;
		if(robot_stopping_point <= 0){
			robot_stopping_point = robot_stopping_point + 2 * Math.PI;
		}
	}
	var picked_up_ball = false;
	var resetting_arm = false;
	var drive = true;
	calculateAngles();
	run();
	function run(){
		//renderer.render( scene, ortho_camera );
		renderer.render( scene, camera );
		if(drive){
			robot_group.rotation.y += 0.01;
			if(robot_group.rotation.y >= Math.PI * 2 && robot_group.rotation.y < Math.PI * 2 + 0.01){
				robot_group.rotation.y = 0;
			}
			if (robot_group.rotation.y > robot_stopping_point && robot_group.rotation.y < robot_stopping_point+0.01){
				robot_group.rotation.y = robot_stopping_point;
				drive = false;
			} else if (robot_group.rotation.y == robot_stopping_point){
				drive = false;
			}
		} else if(!resetting_arm && (shoulder.rotation.y < angle_between_tangent_and_line_to_ball || shoulder.rotation.z > arm_down_angle)) {
			drive = false;
			if(shoulder.rotation.y < angle_between_tangent_and_line_to_ball){
				shoulder.rotation.y += 0.01;
			}
			if(shoulder.rotation.z > arm_down_angle){
				shoulder.rotation.z -= 0.01;
			}
		} else if ( ball_container.parent.id != wrist.id && picked_up_ball == false ) {
			scene.remove(ball_container);
			var new_wrist_height = 0.25+0.7+Math.sin(Math.PI/10)-Math.cos(7*Math.PI/20);
			ball_container.rotation.z = Math.PI;
			ball.position.set(0, -1*new_wrist_height+0.3, 0);
			ball_container.rotation.y = 0;
			ball.rotation.y += angle_between_robot_and_ball/2;
			wrist.add(ball_container);
			picked_up_ball = true;
		} else if ( ball_container.parent.id == wrist.id && shoulder.rotation.y < Math.PI - angle_between_tangent_and_line_to_ball) {
			shoulder.rotation.y += 0.01;
		} else if ( shoulder.rotation.y > 0) {
			shoulder.rotation.y -= 0.01;
			if(ball_container.parent == wrist){
				wrist.remove(ball_container);
				ball.position.set(0,0.3,2);
				ball_container.rotation.z = 0;
				if(robot_group.rotation.y - angle_between_robot_and_ball <= 0){
					ball_container.rotation.y = 2 * Math.PI + robot_group.rotation.y - angle_between_robot_and_ball;
				} else {
					ball_container.rotation.y=robot_group.rotation.y - angle_between_robot_and_ball;
				}
				ball.rotation.y += Math.PI+angle_between_robot_and_ball/2;;
				//ball.rotation.y -= angle_between_robot_and_ball/2;
				scene.add(ball_container);
			}
			resetting_arm = true;
			if(shoulder.rotation.z < arm_up_angle){
				shoulder.rotation.z += 0.01;
			}
		} else {
			resetting_arm = false;
			picked_up_ball = false;
			drive = true;
			calculateAngles();
		}
		requestAnimationFrame(run);
	}
});
