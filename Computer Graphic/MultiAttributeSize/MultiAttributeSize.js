var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;
void main()
{
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}`;

var FSHADER_SOURCE = `
void main()
{
    gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
}`;

function main()
{
    //get the canvas:
    var canvas = document.getElementById("MultiAttributeSize");
    
    //get webgl context:
    var gl = getWebGLContext(canvas);
    
    //initialize the shaders:
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    
    //get the number of vertices:
    var n = initVertexBuffers(gl);

    //set the color of the canvas:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the shape:
    gl.drawArrays(gl.POINTS, 0, n);
}

//define the initvertexBuffers function:
function initVertexBuffers(gl)
{
    //array for the vertices:
    var vertices = new Float32Array([0.0, 0.5, 0.5, 0.0, -0.5, 0.0]);
    //array for the sizes:
    var sizes = new Float32Array([10.0, 20.0, 30.0]);

    //set the number of vertices:
    var n = 3;

    //create buffer objects to the two buffers:
    var vertexBuffer = gl.createBuffer();  
    var sizeBuffer = gl.createBuffer();
    
    //bind vertexBuffer:
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //pass data to the vertexBuffer:
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //assign vertexBuffer:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //enable vertexBuffer: 
    gl.enableVertexAttribArray(a_Position);

    //bind sizeBuffer:
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    //pass data to the sizeBuffer:
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    //assign sizeBuffer:
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    //enable sizeBuffer:
    gl.enableVertexAttribArray(a_PointSize);
  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    //return the number of vertices:
    return n;
}