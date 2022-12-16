/** 
 * Because the goal is to rotate the triangle 90 degrees, sine and cosine of 90
 * have to been calculated. So we create a uniform variables vertex shader 
 * to recieve these values.
 * 
 * Note: U can access x, y and z component handily by the code below:
 * gl_Position.x = ......;
 * 
 * Remember: component w specified to the homogenous system.
 * 
 * 
*/
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_CosB, u_SinB;
  void main() {
    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
    gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
  }`;

//specify the color of the triangle:
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(0.0, 0.4, 0.74, 1.0);\n' +
  '}\n';

//specify the angle of rotation
//note: it is constant during the program (doesn't change)
var ANGLE = 90.0; 

function main() {
  
    //retrive the canvas:
    var canvas = document.getElementById('RotatedTriangle');

    //get the WebGL context:
    var gl = getWebGLContext(canvas);
    //ensure:
    if (!gl) {console.log('Failed to get the rendering context for WebGL'); return;}

    //initialize the shaders:
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {console.log('Failed to intialize shaders.');return;}

    //get the number of vertics:
    var n = initVertexBuffers(gl);
    if (n < 0) {console.log('Failed to set the positions of the vertices');return;}

    /**
    * To use Math.cos() and Math.sin(), these methods exepect degrees in radian
    * So U have to transform the degree to radian system: 
    * 
    * after transform the degree, we create two variables in the js to store
    * sinB and cosB, get the storage location of u_CosB and u_SinB and finally 
    * pass the values to them to the vertex shader. 
    */
    var radian = Math.PI * ANGLE / 180.0; 
    //two variables to hold the values of the cosB and sinB:
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    //get the storage location of u_CosB and u_SinB:
    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
    //ensure:
    if (!u_CosB || !u_SinB) {console.log('Failed to get the storage location of u_CosB or u_SinB');return;}

    //pass the values in cosB and sinB to u_CosB and u_SinB in the vertex shader:
    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    //specify the color of the canvas:
    gl.clearColor(0, 0, 0, 1);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the shape:
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    //set the coordinates of vertices:
    var vertices = new Float32Array([
        0, 0.5,   -0.5, -0.5,   0.5, -0.5
    ]);

    //set the number of vertices:
    var n = 3; 

    //create buffer object:
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }

    //bind the buffer object to the gl.ARRAY_BUFFER (the target):
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    //write data in the buffer:
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //get storage location of a_Position:
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    //assign the buffer object bound by gl.ARRAY_BUFFER to the attribute variable 
    //that specified by the location:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment of the buffer object to the attribute variable 
    //specified by location. 
    gl.enableVertexAttribArray(a_Position);
    
    //return the number of vertices:
    return n;
}