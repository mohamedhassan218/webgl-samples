//create the vshader program:
var VSHADER_SOURCE = `
attribute vec4 myPosition;
uniform float mySize;
void main()
{
    gl_Position = myPosition;
    gl_PointSize = mySize;
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
    var myCan = document.getElementById("IncrementalSizePoints");

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

    //get the storage location of the size:
    var mySize = getUniformFLocation(gl.program, 'mySize'); 

    //register event handler (function) to be called on mouse press:
    myCan.onmousedown = function(ev){ click(ev, gl, myCan, myPosition, mySize, myColor);};


    //set canvas color:
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    //clear the canvas:
    gl.clear(gl.COLOR_BUFFER_BIT);
}

//create two arrays(one for positions and another to colors)
var points = [];
var colors = [];

function click(ev, gl, myCan, myPosition, mySize, myColor)
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
    
    colors.push([Math.random(), Math.random(), Math.random(), 1.0]);
    
    //clear the canvas before any draw:
    gl.clear(gl.COLOR_BUFFER_BIT);

    //get the length of the points array:
    var len = points.length;
    var tempSize = 20.0;
    for(var i = 0; i < len; i++)
    {
        //xy here is an array of two elements:
        var xy = points[i];
        
        //rgba is an array of four elements:
        var rgba = colors[i]; 

        tempSize += (10.0 + i);
        //pass the coordinates to the location of the gl_Position in the webgl system:
        gl.vertexAttrib3f(myPosition, xy[0], xy[1], 0.0);

        //pass the size:
        gl.uniform1f(mySize, tempSize);

        //pass the color to the location of the gl_FragColor in the webgl system:
        gl.uniform4f(myColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        //draw the point:
        gl.drawArrays(gl.POINTS, 0, 1);

    }
}