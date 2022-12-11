//Vertix shader program:
//GLSL ES
var VSHADER_SOURCE = `
void main(){
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);         //coordinates of the point in the canvas.
    gl_PointSize = 10.0;                            //set the point size.
}`

//Fragment shader program:
var FSHADER_SOURCE = `
void main(){
    gl_FragColor = vec4(0.4, 0.43, 0.7, 1.0);        //set the color of the point.
}`


function main()
{   
    //retrieve the canvas
    var myCan = document.getElementById("DrawPoint1");

    //get the webgl context:
    var gl = getWebGLContext(myCan);

    
    //ensure that the canvas is avaliable:
    if(!gl)
    {
        console.log("No Canvas element.");
        return false;
    }


    //ensure that the shaders has been initiated.
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log("Failed to inititalize the shaders.");
        return;
    }

    //set the color of the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //draw the point:
    gl.drawArrays(gl.POINTS, 0, 1);
    
}

