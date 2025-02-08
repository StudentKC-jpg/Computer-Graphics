document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    let prevMouseX,
      prevMouseY,
      snapshot,
      isDrawing = false,
      selectedTool = "pen",
      brushWidth = 5;
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
  
    function drawPen(e) {
      //WRITE YOUR CODE HERE
    }
  
    function drawRectangle(e) {
      //WRITE YOUR CODE HERE
  
      if (fillShapes) {
        //WRITE YOUR CODE HERE
      } else {
        //WRITE YOUR CODE HERE
      }
    }
  
    function drawCircle(e) {
      //WRITE YOUR CODE HERE
  
      if (fillShapes) {
        ctx.fillStyle = document.querySelector("#color-picker").value;
        //WRITE YOUR CODE HERE
      } else {
        //WRITE YOUR CODE HERE
      }
    }
  
    function drawTriangle(e) {
      //WRITE YOUR CODE HERE
  
      if (fillShapes) {
        ctx.fillStyle = document.querySelector("#color-picker").value;
        //WRITE YOUR CODE HERE
      } else {
        //WRITE YOUR CODE HERE
      }
    }
  
    function drawPentagon(e) {
      //WRITE YOUR CODE HERE
  
      if (fillShapes) {
        ctx.fillStyle = document.querySelector("#color-picker").value;
        //WRITE YOUR CODE HERE
      } else {
        //WRITE YOUR CODE HERE
      }
    }
  
    function drawHexagon(e) {
      //WRITE YOUR CODE HERE
  
      if (fillShapes) {
        ctx.fillStyle = document.querySelector("#color-picker").value;
        //WRITE YOUR CODE HERE
      } else {
        //WRITE YOUR CODE HERE
      }
    }
  
    function drawOctagon(e) {
      //WRITE YOUR CODE HERE
  
      if (fillShapes) {
        ctx.fillStyle = document.querySelector("#color-picker").value;
        //WRITE YOUR CODE HERE
      } else {
        //WRITE YOUR CODE HERE
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
      
    }
  
    function handleColorChange() {
      const colorPicker = document.querySelector("#color-picker");
      colorPicker.style.background = colorPicker.value;
    }
  
    function handleClearCanvas() {
      //WRITE YOUR CODE HERE
      
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
  