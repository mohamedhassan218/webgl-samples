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
    var canvas = document.getElementById("MultiAttributeSize_Interleaved");
    
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
    //create one array holds the coordinates and the sizes:
    var verticesSizes = new Float32Array([
        0.0, 0.5, 10.0,     
        0.5, 0.0, 20.0,
        -0.5, 0.0, 30.0]);

    //set the number of vertices:
    var n = 3;

    //create buffer object:
    var verticesSizesBuffer = gl.createBuffer();

    //get the storage location:
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    

    var FSIZE = verticesSizes.BYTES_PER_ELEMENT;

    //bind the buffer to the a_Position:
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesSizesBuffer);
    //write data:
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
    //assign:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    //enable:
    gl.enableVertexAttribArray(a_Position);

    //bind the buffer to the a_PointSize:
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesSizesBuffer);
    //write data:
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
    //assign:
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
    //enable:
    gl.enableVertexAttribArray(a_PointSize);

    //unbind the buffer object:
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}