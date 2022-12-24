//vertex shader program:

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +         //model matrix to hold the translation and rotation:
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';


//fragment shader program:
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\n' +
  '}\n';


//variable to define the rotation angle per second:
var ANGLE_STEP = 45.0;

function main() {

    //retrieve the canvas:
  var canvas = document.getElementById('webgl');


  //get the webgl context:
  var gl = getWebGLContext(canvas);
  if (!gl) 
  {console.log('Failed to get the rendering context for WebGL');return;}


  //initialize the shaders:
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) 
  {console.log('Failed to intialize shaders.');return;}
  
  
  //get the number of vertices:
  var n = initVertexBuffers(gl);
  if (n < 0) 
  {console.log('Failed to set the positions of the vertices');return;}

  //specify the color of the canvas:
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //get the storage location of the u_ModelMatrix:
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) 
  {console.log('Failed to get the storage location of u_ModelMatrix');return;}


  //define the current angle of the shape before any animation:
  var currentAngle = 0.0;
  
  //create matrix4 object:
  var modelMatrix = new Matrix4();


  /**
   * This is an anonymous function do the following steps:
   * 1- Update the current angle of the shape to the new angle after moving it
   *    if the shape begin moving with degree 0, it's updated to 45 after 1 sec and 
   *    updated to 90 after 2 seconds and so on.
   *    This first step done by calling the function animate that you'll create below. 
   * 2- Draw the shape with calling the function draw() that you'll create below.
   * 3- Request the browser to call the function tick() again to redraw the shape.
   */
  var tick = function() 
  {
    //update the current angle with the value returned form animate():
    currentAngle = animate(currentAngle);  
    
    //draw the shape:
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   
    
    //request the browser to call the function tick again:
    requestAnimationFrame(tick, canvas);
  };
  tick();

}

//function to deal with the buffer in WebGL system:
function initVertexBuffers(gl) 
{
    //set the coordinates of vertices:
  var vertices = new Float32Array ([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);

  //set the number of vertices:
  var n = 3;  

  //create buffer object:
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) 
  {console.log('Failed to create the buffer object');return -1;}
 
  //bind the buffer to a target:
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
  //write data to the buffer:
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  //To assign the buffer to an attribute variable, we first need to get the 
  //storage location of the attribute variable:
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0)
  {console.log('Failed to get the storage location of a_Position');return -1;}
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  //enable the assignment:
  gl.enableVertexAttribArray(a_Position);

  //return the number of vertices:
  return n;
}


//In this example we just add translation value with the rotation:
function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
 
    //set the rotate angle:
  modelMatrix.setRotate(currentAngle, 0, 0, 1);
    //set the translation distance:
  modelMatrix.translate(0.6, 0.0, 0.0);


    //pass the data in modelMatrix to the vertex shader:
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //clear the canvas:
  gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the shape:
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

//get the last time that animate called:
var g_last = Date.now();


/**
 * The role of this function is to update the current angle:
 * 1- Get the current time.
 * 2- Find the difference between current time and last time the function has been called. 
 * 3- Update the last time when the function called to be the current time.
 * 4- Calculate the new angle using the elapsedTime to be more accurate.
 * 5- Return the new angle and ensure that it's less than 360.
 */
function animate(angle) 
{
    //get the current time:
  var now = Date.now();
    
    //calculate the difference between t0 and t1:
  var elapsed = now - g_last;
    //update the last time that the function animate called: 
  g_last = now;

    //calculate the new angle:
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    //ensure that the returned angle is less than 360:
  return newAngle %= 360;
}