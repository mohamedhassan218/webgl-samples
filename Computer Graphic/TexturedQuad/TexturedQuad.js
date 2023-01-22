/**
 * The program is structured to five parts:
 * 1- Recieve the texture coordinates in the vertex shader and then pass them to the fragment shader.
 * 2- Paste the texture image onto the geometric shape inside the fragment shader.
 * 3- Set the texture coordinates. (initVertexBuffers())
 * 4- Prepare the texture image for loading, and request the browser to read it. (initTextures())
 * 5- Configure the loaded texture so that it can be used in WebGL (loadTextures())
 */

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +     //variable to get the positions.
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  v_TexCoord = a_TexCoord;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '}\n';

function main() {
    //Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    //Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    //Ensure:
    if (!gl) 
    {console.log('Failed to get the rendering context for WebGL'); return;}

    //Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) 
    {console.log('Failed to intialize shaders.'); return;}

    //Set the vertex information
    var n = initVertexBuffers(gl);
    //Ensure:
    if (n < 0) 
    {console.log('Failed to set the vertex information');return;}

    //Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //Set texture
    if (!initTextures(gl, n)) 
    {console.log('Failed to intialize the texture.');return;}
}


//Its job is to set the texture coordinates:
function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        //Array holds the values of vertex coordinates and texture coordinates:
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);

    //The number of vertices:
    var n = 4;

    //Create the buffer object:
    var vertexTexCoordBuffer = gl.createBuffer();
    //ensure it has been created:
    if (!vertexTexCoordBuffer) { console.log('Failed to create the buffer object'); return -1; }


    //Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);

    //Pass the data to the buffer object:
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    //Store the size per element of the Float32Array (in bytes):
    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    //Get the storage location of a_Position and a_TexCoord:
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    //ensure:
    if (a_Position < 0) { console.log('Failed to get the storage location of a_Position'); return -1; }
    if (a_TexCoord < 0) { console.log('Failed to get the storage location of a_TexCoord'); return -1; }


    //Assign the buffer object to a_Position to pass the coordinates of vertices:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);  //Enable the assignment of the buffer object

    // Assign the buffer object to a_TexCoord variable to pass the texture coordinates:
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

    //return the number of vertices:
    return n;
}

//Its job is to set up and load the image:
function initTextures(gl, n) {

    //Create a texture object to hold a texture image: 
    var texture = gl.createTexture();
    //ensure:
    if (!texture) 
    {console.log('Failed to create the texture object'); return false;}

    // Get the storage location of u_Sampler
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    //ensure:
    if (!u_Sampler) 
    {console.log('Failed to get the storage location of u_Sampler');return false;}

    //Create image object and then we'll request the browser to load it to be mapped to the quad:
    var image = new Image(); 
    //ensure:
    if (!image) 
    {console.log('Failed to create the image object'); return false;}
    
    //Register the event handler to be called on loading an image
    image.onload = function () { loadTexture(gl, n, texture, u_Sampler, image); };
    
    //Tell the browser to load an image
    image.src = 'Hala Madrid.png';
    
    return true;
}

//Its job is to make the texture ready to use in WebGL system:
function loadTexture(gl, n, texture, u_Sampler, image) {
    
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}