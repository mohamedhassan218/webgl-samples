/**
 * Instead of using the mathimatical expression, we use in this example
 *  the concept of translation matrix.
 *  Here, we use it to scale the triangle:-
 */
//vertex shader program:
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +      //create attribute variable to set the position from the js.
  'uniform mat4 u_xformMatrix;\n' +     //create uniform variable of the type mat4 to set
  'void main() {\n' +                   // in it the translation and rotation matrix:
  '  gl_Position = u_xformMatrix * a_Position;\n' +
  '}\n';

//fragment shader program:
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.4, 0.74, 1.0);\n' +
  '}\n';

//scaling values to x, y and z:
var Sx = 1.0, Sy = 1.5, Sz = 1.0;

function main() {

    //retrieve the canvas:
  var canvas = document.getElementById('ScaledTriangle_Matrix');

    //get the webgl context:
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

    //initialize the shaders:
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
 
    //get the number of vertices:
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

    //here we set the values that will be set in the matrix:
    //Note: the WebGL is column major order:
  var xformMatrix = new Float32Array([
     Sx, 0.0, 0.0, 0.0,
     0.0, Sy, 0.0, 0.0,
     0.0,  0.0, Sz, 0.0,
     0.0,  0.0, 0.0, 1.0
  ]);


  //get the storage location of the matrix in the vertex shader:
  var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (!u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }

  //send the values to the matrix in the vertex shader:
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

  //set the clear color:
  gl.clearColor(0, 0, 0, 1);

  //clear the canvas:
  gl.clear(gl.COLOR_BUFFER_BIT);

  //draw the shape:
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    //write the coordinates of the vertices:
  var vertices = new Float32Array([
    0, 0.5,   -0.5, -0.5,   0.5, -0.5
  ]);

  //set the number of vertices:
  var n = 3;

  //create buffer object:
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  //bind the buffer object to the target:
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  //write data to the buffer:
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  //get the storage location of the attribute variable:
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }

  //assign the buffer object to the attribute variable:
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  //enable the assignment of a buffer object to the attribute variable specified by the location:
  gl.enableVertexAttribArray(a_Position);

  //return the number of vertices:
  return n;
}
