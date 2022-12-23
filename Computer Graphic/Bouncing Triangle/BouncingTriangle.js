var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
attribute vec4 a_Color;
varying vec4 v_Color;
void main()
{
    gl_Position = u_ModelMatrix * a_Position;
    v_Color = a_Color;
}`;

var FSHADER_SOURCE = `
precision mediump float;
varying  vec4 v_Color;
void main()
{
    gl_FragColor = v_Color;
}`;

var Tx = 0.019, Ty = 0.004;
var x = 0.0, y = 0.0;

function main()
{
    var canvas = document.getElementById("p1");
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    var n = initVertexBuffers(gl);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    var myModelMatrix = new Matrix4();
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var tick = function()
    {
        updateTranslation();                                //update:
        draw(gl, n, myModelMatrix, u_ModelMatrix, x, y);    //draw:
        requestAnimationFrame(tick, canvas);                //request to be called again:
    };

    tick();
}


function initVertexBuffers(gl)
{
    var verticesColors = new Float32Array([
        0.0, 0.4, 1.0, 0.0, 1.0,
        0.3, 0.0, 1.0, 1.0, 0.0, 
        -0.3, 0.0, 0.0, 1.0, 1.0, 
        
    ]);

    var n = 3;

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    var verticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}


var lastCall = Date.now();

function updateTranslation()
{
    var now = Date.now();
    var elapsed = now - lastCall;
    lastCall = now;
    x = x + (Tx * elapsed) / 1000.0;
    y = y + (Ty * elapsed) / 1000.0;

    if(x > 0.006 || x < -0.006) 
    {Tx *= -1;}
    if(y > 0.0055 || y < -0.008) 
    {Ty *= -1;}
}

function draw(gl, n, myModelMatrix, u_ModelMatrix, x, y)
{
    myModelMatrix.translate(Tx, Ty, 0.0);

    gl.uniformMatrix4fv(u_ModelMatrix, false, myModelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}