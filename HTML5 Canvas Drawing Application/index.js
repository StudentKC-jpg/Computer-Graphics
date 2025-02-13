document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    let prevMouseX,
        prevMouseY,
        snapshot,
        isDrawing = false,
        selectedTool = "pen",
        brushWidth = 5;
        radius = 0; //added radius of shape 
        sides = 0; //added sides of shape
    let fillShapes = false;


    function initializeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        setCanvasBackground();
    }

    function setCanvasBackground() {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    //added radius calculated by distance formula
    function calcRadius(x, y){
        return Math.sqrt(Math.pow(x - prevMouseX,2) + Math.pow(y - prevMouseY, 2));
    }

    function drawPolygon(numOfSides, radius){
        ctx.beginPath();
        for (let i = 0; i <= numOfSides; i++){
            let angle = (i * 2 * Math.PI) / numOfSides - Math.PI / 2; // angle of points equally spaced
            let x = prevMouseX + radius * Math.cos(angle); // x
            let y = prevMouseY + radius * Math.sin(angle); // y
            
            if(i == 0){
                ctx.moveTo(x, y); // first point
            } else{
                ctx.lineTo(x, y); // next points
            }
        }
    }

    function drawPen(e) {
        //WRITE YOUR CODE HERE
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    function eraser(e) {
        //WRITE YOUR CODE HERE
        
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    function drawRectangle(e) {
        //WRITE YOUR CODE HERE
        

        if (fillShapes) {
            //WRITE YOUR CODE HERE
            ctx.fillRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
        } else {
            //WRITE YOUR CODE HERE
            ctx.strokeRect(prevMouseX, prevMouseY, e.offsetX - prevMouseX, e.offsetY - prevMouseY);
        }
    }

    function drawCircle(e) {
        //WRITE YOUR CODE HERE
        radius = calcRadius(e.offsetX, e.offsetY);
        ctx.beginPath();
        ctx.arc(prevMouseX, prevMouseY, radius, 0, Math.PI * 2);

        if (fillShapes) {
            //WRITE YOUR CODE HERE
            ctx.fill()
        } else {
            //WRITE YOUR CODE HERE
            ctx.stroke();
        }
    }

    function drawTriangle(e) {
        //WRITE YOUR CODE HERE
        // ctx.beginPath();
        // ctx.moveTo(prevMouseX, prevMouseY); //top
        // ctx.lineTo(e.offsetX, e.offsetY); //2nd point
        // ctx.lineTo(2 * prevMouseX - e.offsetX, e.offsetY); //3rd point -> mirror of 2nd
        // ctx.closePath(); //connects top

        sides = 3;
        radius = calcRadius(e.offsetX, e.offsetY);
        drawPolygon(3, radius);


        if (fillShapes) {
            //WRITE YOUR CODE HERE
            ctx.fill();
        } else {
            //WRITE YOUR CODE HERE
            ctx.stroke();
        }
    }

    function drawPentagon(e) {
        //WRITE YOUR CODE HERE
        radius = calcRadius(e.offsetX, e.offsetY);
        sides = 5;
        drawPolygon(sides, radius);

        // for (let i = 0; i <= sides; i++){
        //     let angle = (i * 2 * Math.PI) / sides - Math.PI / 2; // angle of points equally spaced
        //     let x = prevMouseX + radius * Math.cos(angle); // x
        //     let y = prevMouseY + radius * Math.sin(angle); // y
            
        //     if(i == 0){
        //         ctx.moveTo(x, y); // first point
        //     } else{
        //         ctx.lineTo(x, y); // next points
        //     }
        // }

        if (fillShapes) {
            //WRITE YOUR CODE HERE
            ctx.fill();
        } else {
            //WRITE YOUR CODE HERE
            ctx.stroke();
        }
    }

    function drawHexagon(e) {
        //WRITE YOUR CODE HERE
        radius = calcRadius(e.offsetX, e.offsetY);
        sides = 6;
        drawPolygon(sides, radius);

        if (fillShapes) {
            //WRITE YOUR CODE HERE
            ctx.fill();
        } else {
            //WRITE YOUR CODE HERE
            ctx.stroke();
        }
    }

    function drawOctagon(e) {
        //WRITE YOUR CODE HERE
        radius = calcRadius(e.offsetX, e.offsetY);
        sides = 8;
        drawPolygon(sides, radius);

        if (fillShapes) {
            //WRITE YOUR CODE HERE
            ctx.fill();
        } else {
            //WRITE YOUR CODE HERE
            ctx.stroke();
        }
    }

    function startDraw(e) {
        isDrawing = true;
        prevMouseX = e.offsetX;
        prevMouseY = e.offsetY;
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = document.querySelector("#color-picker").value;
        ctx.fillStyle = ctx.strokeStyle;
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.putImageData(snapshot, 0, 0); // Restore the previous state
        switch (selectedTool) {
            case "pen":
                drawPen(e);
                break;
            case "rectangle":
                drawRectangle(e);
                break;
            case "circle":
                drawCircle(e);
                break;
            case "triangle":
                drawTriangle(e);
                break;
            case "pentagon":
                drawPentagon(e);
                break;
            case "hexagon":
                drawHexagon(e);
                break;
            case "octagon":
                drawOctagon(e);
                break;
        }
    }

    function handleToolSelection(e) {
        const activeTool = document.querySelector(".options .active");
        if (activeTool) activeTool.classList.remove("active");
        e.currentTarget.classList.add("active");
        selectedTool = e.currentTarget.id;
    }

    function handleSliderChange() {
        //WRITE YOUR CODE HERE
        brushWidth = document.querySelector("#size-slider").value;
    }

    function handleColorChange() {
        const colorPicker = document.querySelector("#color-picker");
        colorPicker.style.background = colorPicker.value;
    }

    function handleClearCanvas() {
        //WRITE YOUR CODE HERE
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasBackground();
    }

    function handleFillShapesChange() {
        fillShapes = document.querySelector("#fill-shapes").checked;
    }

    document
        .querySelectorAll(".tool")
        .forEach((btn) => btn.addEventListener("click", handleToolSelection));
    document
        .querySelector("#size-slider")
        .addEventListener("change", handleSliderChange);
    document
        .querySelector("#color-picker")
        .addEventListener("change", handleColorChange);
    document
        .querySelector(".clear-canvas")
        .addEventListener("click", handleClearCanvas);
    document
        .querySelector("#fill-shapes")
        .addEventListener("change", handleFillShapesChange);
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => (isDrawing = false));

    initializeCanvas();
});