var VSHADER_SOURCE = `
void main(){
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
}`

var FSHADER_SOURCE = `
void main(){
    gl_FragColor = vec4(0.0, 0.4, 0.7, 1.0);
}`

function main()
{
    var myCan = document.getElementById("test");

    var gl = getWebGLContext(myCan);

    //initiate the shaders:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log("Failed to intiate shaders.")
        return;
    }

    //canvas color:
    gl.clearColor(0.0, 0.0, 0.0, 1);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the point:
    gl.drawArrays(gl.POINTS, 0, 1);
    
}