//vertex shader:
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_modelMatrix;                                 //if the matrix do multiple transformations,
void main()                                                 //we call it model matrix
{
    gl_Position = u_modelMatrix * a_Position;            
}`;                                                     

//fragment shader program:
var FSHADER_SOURCE = `
void main()
{
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}`;

//main function:
function main()
{
    //retrieve the canvas:
    var myCan = document.getElementById("TranslatedRotatedTriangle");

    //render the webgl context:
    var gl = getWebGLContext(myCan);

    //initialize the shaders:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {console.log("Failed to initialize the shaders."); return;}


    //get the number of vertices:
    var n = initVertexBuffers(gl);

    //the angle of rotation:
    var angle = 60;

    //the distance of translation:
    var Tx = 0.4;

    //create matrix4 object to set the values in it:
    var myMatrix = new Matrix4();

    //we wanna to rotate first:
    myMatrix.setTranslate(Tx, 0.0, 0.0);
    myMatrix.rotate(angle, 0.0, 0.0, 1.0);


    //now, we have to push the model matrix to the vertex shader:
    //get the storage location of u_modelMatrix:
    var u_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');

    //push the data:
    gl.uniformMatrix4fv(u_modelMatrix, false, myMatrix.elements);

    //set the color of the canvas:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl)
{
    //set the coordinates of the vertices:
    var vertices = new Float32Array([0.0, 0.3, 0.3, 0.0, -0.3, 0.0]);

    //the number of vertices:
    var n = 3;

    //create buffer object:
    var vertexBuffer = gl.createBuffer();

    //bind the buffer object to a target: 
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //write data to the buffer object:
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


    //to assign the buffer object to the attribute variable, we 
    //need first to get the storage location of the attribute variable:
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");

    //assign the buffer object to the attribute variable:
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment of the buffer object to the attribute variable specified by the location:
    gl.enableVertexAttribArray(a_Position);

    return n;
}