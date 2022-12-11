//The goal is to pass a position from the js program to the vertex shader.
//the steps:
//      1- prepare attribute variable in the vertex shader
//      2- assign it to the gl_Position
//      3- pass data to the attribute variable

var VSHADER_SOURCE = `
attribute vec4 myPosition;                                          //step 1
void main(){
    gl_Position = myPosition;                                       //step 2
    gl_PointSize = 10.0;
}`

var FSHADER_SOURCE = `
void main(){
    gl_FragColor = vec4(0.0, 0.4, 0.7, 1.0);
}`

function main()
{
    //retrieve canvas element:
    var myCan = document.getElementById("HelloPoint2");

    //get the rendering context for WebGL:
    var gl = getWebGLContext(myCan);

    //ensure that the context is been rendered:
    if(!gl)
    {
        console.log("Failed to get the rendering context from WebGL.");
        return; 
    }

    //initialize shaders:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log("Failed to initialize shaders.");
        return;
    }

    //get storage location of the attribute variable:
    var myPosition = gl.getAttribLocation(gl.program, 'myPosition');

    //ensure that the storage is avaliable:
    if(myPosition)
    {
        console.log("Failed to get the storage location");
        return;
    }

    //pass vertex position to attribute variable:
    gl.vertexAttrib3f(myPosition, 0.0, 0.0, 0.0);                   //step 3


    //set canvas color:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the point:
    gl.drawArrays(gl.POINTS, 0, 1);

}