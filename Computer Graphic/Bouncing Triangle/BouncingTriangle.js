//vertex shader program:
var VSHADER_SOURCE = `
attribute vec4 a_Position;                      //variable to get the values of position from js.
uniform mat4 u_ModelMatrix;                     //matrix to hold the rotation and translation matrix.
attribute vec4 a_Color;                         //variable to get the color from the js.
varying vec4 v_Color;                           //bridge between the vertex shader and the fragment shader.
void main()
{
    gl_Position = u_ModelMatrix * a_Position;   //calculate the position with translation and rotation.
    v_Color = a_Color;                          //store the value from js to v_Color.
}`;

//fragment shader program:
var FSHADER_SOURCE = `
precision mediump float;                        //this line must be written (explained in chapter 6).
varying  vec4 v_Color;                          //bridge between V and F to set the color to the fragment shadre.
void main()
{
    gl_FragColor = v_Color;                     //store the value of color from the vertex shader.
}`;

//set the translation step over x and y axies:
//Global variables.
var Tx = 0.2, Ty = 0.11;

//set the current position of x and y to 0:
//Global variables.
var x = 0.0, y = 0.0;

//Main function:
function main()
{
    //retrieve the canvas:
    var canvas = document.getElementById("p1");
    
    //get webgl context:
    var gl = getWebGLContext(canvas);
    
    //initialize the shaders:
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    
    //get the number of vertices:
    var n = initVertexBuffers(gl);

    //get the storage location of the u_ModelMatrix:
    var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    
    //create matrix4 object:
    var myModelMatrix = new Matrix4();
    
    //set the color of the canvas:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //this function do three tasks:
    //1- Update the current value of x and y.
    //2- Draw the shape. 
    //3-Request the browser to call it again.
    var tick = function()
    {
        updateTranslation();                                //update:
        draw(gl, n, myModelMatrix, u_ModelMatrix, x, y);    //draw:
        requestAnimationFrame(tick, canvas);                //request to be called again:
    };

    tick();
}


function initVertexBuffers(gl)
{
    //set the data of vertices in Float32Array object:
    var verticesColors = new Float32Array([
        0.0, 0.4, 1.0, 0.0, 1.0,
        0.3, 0.0, 1.0, 1.0, 0.0, 
        -0.3, 0.0, 0.0, 1.0, 1.0, 
        
    ]);

    //set the number of vertices:
    var n = 3;

    //store the size per element (in bytes) of the Float32Array:
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    //create buffer object:
    var verticesColorBuffer = gl.createBuffer();

    //bind the buffer object to the target:
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesColorBuffer);

    //write data to the buffer:
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    //get storage location of a_Color and a_Position:
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    //assign the buffer object to a_Position and enable the assignment:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    //assign the buffer object to a_Color and enable the assignment:
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    //unbind the buffer:
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //return the number of vertices:
    return n;
}


//variable to hold the last time that updateTranslation() has been called:
var lastCall = Date.now();


function updateTranslation()
{
    //get current time:
    var now = Date.now();

    //calculate elapsed time between current time and last time the function has been called:
    var elapsed = now - lastCall;

    //update the last time the function has been called to be now:
    lastCall = now;

    //update x and y values using the elapsed time to be more accurate:
    x = x + (Tx * elapsed) / 1000.0;
    y = y + (Ty * elapsed) / 1000.0;

    //limit the moving of the shape:
    if(x > 1.0 || x < -1.0) 
    {Tx *= -1;}
    if(y > 0.8 || y < -1.0) 
    {Ty *= -1;}
}


function draw(gl, n, myModelMatrix, u_ModelMatrix, x, y)
{
    //set the value of translation to the matrix4 object:
    myModelMatrix.setTranslate(x, y, 0.0);

    //pass the data in matrix4 object to the vertex shader:
    gl.uniformMatrix4fv(u_ModelMatrix, false, myModelMatrix.elements);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the shape:
    gl.drawArrays(gl.TRIANGLES, 0, n);
}