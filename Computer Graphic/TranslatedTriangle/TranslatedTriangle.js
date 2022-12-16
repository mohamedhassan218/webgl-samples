var VSHADER_SOURCE = `
attribute vec4 a_Position;      //attribute variable to store the position
uniform vec4 u_Translation;     //attribute variable to hold the value of translation
void main()
{
    gl_Position = a_Position + u_Translation;
}`

var FSHADER_SOURCE = `
void main()
{
    gl_FragColor = vec4(0.0, 0.4, 0.74, 1.0);
}`

//translation distance to x, y and z directions:
var Tx = 0.5, Ty = 0.5, Tz = 0;

function main()
{
    //retrieve the canvas:
    var myCan = document.getElementById("TranslatedTriangle");

    //get the webgl context:
    var gl = getWebGLContext(myCan);
    if(!gl){console.log("Failed to get the webgl context."); return;}

    //initialize the shaders:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {console.log("Failed to initialize the shaders."); return;}

    //write the positions of vertices to the vertex shader:
    var n = initVertexBuffers(gl);
    if(n < 0){console.log("Failed to get the positions of vertices."); return;}

    //get the storage location of u_Translation:
    var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    if(!u_Translation){console.log("Failed to get the storage location of u_Translation"); return;}

    //pass the translation distance to the vertex shader:
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);

    //specify the canvas color:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the triangle:
    gl.drawArrays(gl.TRIANGLES, 0, n);
}


function initVertexBuffers(gl)
{
    //set the coordinates of the vertics:
    var vertices = new Float32Array([0, 0.5, -0.5, -0.5, 0.5, -0.5]);

    var n = 3;

    //create buffer object:
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){console.log("Failed to create the buffer object"); return -1;}

    //bind the buffer object to the target:
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //write data specified in vertices to the buffer object bound to gl.ARRAY_BUFFER:
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //Assign the buffer object to the attribute variable:
    //get storage location of a_Position:
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){console.log("Failed to the storage location of a_Position."); return;}
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment to a_Position:
    gl.enableVertexAttribArray(a_Position);
    return n;
}