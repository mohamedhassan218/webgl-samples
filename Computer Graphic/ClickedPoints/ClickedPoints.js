//VSHADER_SOURCE:
var VSHADER_SOURCE = `
attribute vec4 myPosition;
void main(){
    gl_Position = myPosition;
    gl_PointSize = 10.0;
}`

//FSHADER_SOURCE:
var FSHADER_SOURCE = `
void main(){
    gl_FragColor = vec4(0.0, 0.4, 0.7, 1.0);
}`


function main()
{
    //retrieve the canvas:
    var myCan = document.getElementById("ClickedPoints");

    //render the WebGL context:
    var gl = getWebGLContext(myCan);

    //ensure
    if(!gl)
    {
        console.log("Failed to get the rendering context of WebGL.");
        return;
    }

    //initialize shaders and ensure:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log("Failed to initialize the shaders.");
        return;
    }

    //get storage location:
    var myPosition = gl.getAttribLocation(gl.program, 'myPosition');

    //register function to be called on a mouse press:
    //this function called event handler.
    //the technique to define this function called anoymous function.
    myCan.onmousedown = function(ev){click(ev, gl, myCan, myPosition);};

    //specify the clear color of the canvas:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    
    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);
}

//array for the mouse click positions:
var points = [];

//declare the click function:
//here's what it does:
//1- Retrieve the position of the mouse click.
//2- Clear the canvas.
//3- For each position stored in the array, draw a point.
function click(ev, gl, myCan, myPosition)
{
    //info about the mouse click stored as an event object, passed to the click function
    //by the browser using the arg ev
    //ev holds the position info and you can get the coordinates by using ev.clientX and ev.clientY.
    var x = ev.clientX;
    var y = ev.clientY;

    //gets the postition of the canvas in the client area.
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - myCan.height/2) / (myCan.height / 2);
    y = (myCan.width / 2 - (y - rect.top)) / (myCan.width/2);

    //store the coordinates to the mouse array:
    points.push(x);
    points.push(y);

    //clear the canvas:
    //try to run without clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = points.length;
    for(var i = 0; i < len; i += 2)
    {
        //pass the position of a point in x and y as a result of mouse click to myPosition variable:
        gl.vertexAttrib3f(myPosition, points[i], points[i+1], 0.0);

        //draw a point:
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}