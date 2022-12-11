    var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main()
    {
        gl_Position = a_Position;
    }`
    
    var FSHADER_SOURCE = `
    void main()
    {
        gl_FragColor = vec4(0.0, 0.4, 0.74, 1.0);
    }`
    
    function main()
    {
        //retrieve the canvas:
        var myCan = document.getElementById('HelloTriangleLINE_STRIP');
       
        //get WebGL context:
        var gl = getWebGLContext(myCan);
        if(!gl)
        {console.log("Failed to get the context.");return;}
    
        //initialize the shaders:
        if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
        {console.log("Failed to initialize the shaders");return;}
    
        //assign the number of vertices to a variable n:
        var n = initVertexBuffers(gl);
        
        if(n < 0)
        {console.log("Failed to set the positions of the vertices."); return;}
    
        //choose the color of the canvas:
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
        //clear the canvas:
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        //draw the shape:
        gl.drawArrays(gl.LINE_STRIP, 0, n);
    }
    
    //create function to use the buffer object:
    function initVertexBuffers(gl)
    {
        //write the coordinates of the vertices in float32 array:
        var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    
        //assign the number of vertices:
        var n = 3;
    
        //create buffer object:
        var vertexBuffer = gl.createBuffer();               //(1)
        
        if(!vertexBuffer)
        {console.log("Failed to create buffer object."); return -1;}
    
        //bind the buffer object to the attribute variable:
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);       //(2)
    
        //write data in the buffer object:
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);   //(3)
    
        //get the storage location of the attribute variable:
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    
        
        if(a_Position < 0)
        {console.log("failed to get the storage location of the a_Position."); return;}
    
        //assign the buffer object bound to gl.ARRAY_BUFFER to the attribute variable:
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);   //(4)
    
        //enable the assignment of a buffer object to the attribute variable:
        gl.enableVertexAttribArray(a_Position);                     //(5)
    
        return n;
    }