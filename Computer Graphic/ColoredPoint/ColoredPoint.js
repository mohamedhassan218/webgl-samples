//create the vshader program:
var VSHADER_SOURCE = `
attribute vec4 myPosition;
void main()
{
    gl_Position = myPosition;
    gl_PointSize = 10.0;
}`

//create the fshader program:
var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 myColor;
void main()
{
    gl_FragColor = myColor;
}`

//main function:
function main()
{
    //retrieve the canvas:
    var myCan = document.getElementById("ColoredPoints");

    //get webgl context:
    var gl = getWebGLContext(myCan);

    //ensure
    if(!gl)
    {console.log("gl object didn't created."); return;}
    
    //initialize the shaders:
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {console.log("Failed to initialize the shaders."); return;}

    //get the storage location of myPosition:
    var myPosition = gl.getAttribLocation(gl.program, 'myPosition');

    //ensure
    if(myPosition < 0)
    {console.log("Failed to get the location of myPosition"); return;}

    //get the storage location of myColor:
    var myColor = gl.getUniformLocation(gl.program, 'myColor');

    //ensure
    if(!myColor)
    {console.log("Failed to get the storage location of myColor"); return;}

    //register event handler (function) to be called on mouse press:
    myCan.onmousedown = function(ev){ click(ev, gl, myCan, myPosition, myColor)};


    //set canvas color:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);
}

//create two arrays(one for positions and another to colors)
var points = [];
var colors = [];

function click(ev, gl, myCan, myPosition, myColor)
{
    //get x and y coordinates before implement the equation:
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    //implement the equation to utilize the ration between the web page and the canvas:
    x = ((x - rect.left) - (myCan.width/2)) / (myCan.width / 2);
    y = ((myCan.height / 2) - (y - rect.top)) / (myCan.height / 2);
  
    //store the coordinates to the points array:
    //note: we pass two value each time, so points is array of arrays(two dimentional array)
    points.push([x, y]);
    
    //store the color to the colors array
    //note: colors is an array of arrays each array has four values (RGBA)
    if(x >= 0.0 && y >= 0.0)
        {colors.push([1.0, 0.0, 0.0, 1.0]);}//red
    else if (x < 0.0 && y < 0.0)
        {colors.push([0.0, 1.0, 0.0, 1.0]);}//green
    else
        {colors.push([1.0, 1.0, 1.0, 1.0]);}//white

    //clear the canvas before any draw:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //get the length of the points array:
    var len = points.length;

    for(var i = 0; i < len; i++)
    {
        //xy here is an array of two elements:
        var xy = points[i];
        
        //rgba is an array of four elements:
        var rgba = colors[i]; 

        //pass the coordinates to the location of the gl_Position in the webgl system:
        gl.vertexAttrib3f(myPosition, xy[0], xy[1], 0.0);

        //pass the color to the location of the gl_FragColor in the webgl system:
        gl.uniform4f(myColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        //draw the point:
        gl.drawArrays(gl.POINTS, 0, 1);

    }
}