//vertex shader:
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 xformMatrix;
void main()
{
    gl_Position = xformMatrix * a_Position;
}`;

//fragment shader:
var FSHADER_SOURCE = `
void main()
{
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}`;

//set the rotation angle:
var ANGLE = 90;

function main()
{
    //retrieve the canvas:
    var myCan = document.getElementById("RotatedTriangle_Matrix4");

    //render the webgl context:
    var gl = getWebGLContext(myCan);

    //initialize the shaders:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {console.log("failed to initialize the shaders."); return;}

    //get the number of vertices:
    var n = initVertexBuffers(gl);


    //create object of Matrix4:
    var xformMatrix = new Matrix4();

    //set the rotate angle to the matrix:
    //setRotate: method takes the angle of rotation, and 3 numbers (x, y, z)to choose the axies to rotate around it:
    //in this example it rotate around the z axies
    //Note: the ANGLE isn't in radian system.
    xformMatrix.setRotate(ANGLE, 0, 0, 1);
    
    //get the storage location of xformMatrix:
    var u_xformMatrix = gl.getUniformLocation(gl.program, "xformMatrix");

    //pass the values in matrix 4 to the vertex shader:
    //xformMatrix.elements: give you the elements in the Matrix4 object:
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);


    //set the color of the canvas:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the shape:
    gl.drawArrays(gl.TRIANGLES, 0, n);

}


//initialize the initVertexBuffers:
function initVertexBuffers(gl)
{
    //set the coordinates of the points:
    var vertics = new Float32Array([0, 0.5,   -0.5, -0.5,   0.5, -0.5]);

    //set the number of vertices:
    var n = 3;

    //create buffer object:
    var vertexBuffer = gl.createBuffer();

    //bind the buffer object to a target:
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //write data to the buffer object:
    gl.bufferData(gl.ARRAY_BUFFER, vertics, gl.STATIC_DRAW);

    //get the storage location of a_Position:
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    //assign the buffer object to the attribute variable:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment of the buffer object to the attribute variable specified by the location:
    gl.enableVertexAttribArray(a_Position);

    return n;
}