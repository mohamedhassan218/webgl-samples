//vertex shader program:
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;       //We can understand this variable as a bridge between the f and v shaders:
void main()
{
    gl_Position = a_Position;
    gl_PointSize = 10.0;
    v_Color = a_Color;
}`;

//fragment shader program:
var FSHADER_SOURCE = `
precision mediump float;
varying vec4 v_Color;       //Note, we must name it with the same name in the vertex shader:
void main()
{
    gl_FragColor = v_Color;
}`;

function main()
{
    //retrieve the canvas:
    var myCan = document.getElementById("ColoredTriangle");

    //get the webgl context:
    var gl = getWebGLContext(myCan);

    //initialize the shaders:
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    //get the number of vertices:
    var n = initVertexBuffers(gl);

    //set the canvas color:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the shape:
    gl.drawArrays(gl.TRIANGLES, 0, n);

}


//define the function initVertexBuffer:
function initVertexBuffers(gl)
{
    //set the data of vertices:
    var verticesColors = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 1.0, 
        0.5, -0.5, 1.0, 1.0, 0.0, 
        -0.5, -0.5, 0.0, 1.0, 1.0]);

    //set the number of vertices:
    var n = 3;

    //create buffer object:
    var vertexBuffer = gl.createBuffer();


    //calculate the FSIZE(the size in bytes of the elements in the verticesColors)
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    //bind the buffer:
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //write coordinates data:
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    //deal with a_Position:
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //assign:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    //enable:
    gl.enableVertexAttribArray(a_Position);

    //deal with a_Color:
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    //enable:
    gl.enableVertexAttribArray(a_Color);

    return n;
}