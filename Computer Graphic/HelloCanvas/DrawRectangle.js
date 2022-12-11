function main()
{
    //retrieve the canvas element:
    var myCan = document.getElementById("moFirstCanvas");//canvas

    //get the rendering context of the WebGL:
    var gl = getWebGLContext(myCan);

    //ensure
    if(!gl)
    {console.log("Canvas is unavialable."); return false;}

    //set clear color:
    gl.clearColor(0.0, 0.0, .75, 1.0);

    //clear the canvas:
    //COLOR_BUFFER_BIT: you're telling the WebGL to use the color buffer when clearing the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);
    
}