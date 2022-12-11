//There are five steps to use buffer object:
/*  
    1- Create buffer object ---> gl.createBuffer()
    2- Bind the buffer object to a target ---> gl.bindBuffer()
    3- Write data into buffer object ---> gl.bufferData()
    4- Assign buffer object to an attribute variable ---> gl.vertexAttribPointer()
    5- Enable assignment ---> gl.enableVertexAttribArray()
 */
var VSHADER_SOURCE = `
attribute vec4 a_Position;
void main()
{
    gl_Position = a_Position;
    gl_PointSize = 10.0;
}`

var FSHADER_SOURCE = `
void main()
{
    gl_FragColor = vec4(0.0, 0.4, 0.74, 1.0);
}`

function main()
{
    //retrieve the canvas:
    var myCan = document.getElementById('MultiPoint');

    //get the webgl context:
    var gl = getWebGLContext(myCan);
    if(!gl)
    {console.log("Failed to get the context.");return;}

    //initialize the shaders:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {console.log("Failed to initialize the shaders");return;}

    //set position of vertices to the vertex shader:
    var n = initVertexBuffers(gl);
    //ensure:
    if(n < 0)
    {console.log("Failed to set the positions of the vertices."); return;}

    //set the color of the canvas:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the points:
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffers(gl)
{
    //set the vertices:
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

    //number of vertices:
    var n = 3;

    //create a buffer object:
    var vertexBuffer = gl.createBuffer();
    //ensure:
    if(!vertexBuffer)
    {console.log("Failed to create buffer object."); return -1;}

    //bind the buffer object to the target:
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //write the data into the buffer object:
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //get the storage location of the a_Position:
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    //ensure:
    if(a_Position < 0)
    {console.log("failed to get the storage location of the a_Position."); return;}

    //assign the buffer object to a_Position variable:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment to a_Position variable:
    gl.enableVertexAttribArray(a_Position);

    return n;
}