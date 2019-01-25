
var STAGE_WIDTH, STAGE_HEIGHT;

var a1 = 0, r = 1, n = 10;

var GRID_SIZE = 22;

var drawings = [];

/*
 * Initialize the stage and some createJS settings
 */
function init() {
    STAGE_WIDTH = parseInt(document.getElementById("gameCanvas").getAttribute("width"));
    STAGE_HEIGHT = parseInt(document.getElementById("gameCanvas").getAttribute("height"));

    createjs.ColorPlugin.install();

    // Init stage object.
    stage = new createjs.Stage("gameCanvas");
    stage.mouseEventsEnabled = true;
    stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

    setupManifest(); // preloadJS
    startPreload();

    initListeners();

    stage.update();
}

/*
 * Place graphics and add them to the stage.
 */
function initGraphics() {

  $("#equation-values #span-a1").html(a1.toFixed(1));
  $("#equation-values #span-r").html(r.toFixed(1));
  $("#equation-values #span-n").html(n);

  // Add the grid image as the background of the canvas.
  stage.addChild(grid);

  drawSequence();

  stage.update();
}

function initListeners() {
  document.getElementById("range-a1").oninput = function () {
    a1 = parseInt(this.value) / 10;
    $("#equation-values #span-a1").html(a1.toFixed(1));
    drawSequence();
  }
  document.getElementById("range-r").oninput = function () {
    r = parseInt(this.value) / 10;
    $("#equation-values #span-r").html(r.toFixed(1));
    drawSequence();
  }
  document.getElementById("range-n").oninput = function () {
    n = parseInt(this.value);
    $("#equation-values #span-n").html(n);
    drawSequence();
  }
}

function drawSequence() {

  for (drawing of drawings) {
    stage.removeChild(drawing);
  }

  drawings = [];

  for (var i = 1; i <= n; i++) {
    let ai = a1 * Math.pow(r, i - 1);
    var circle = new createjs.Shape();
    var g = circle.graphics;
    g.setStrokeStyle(1);
    g.beginFill("#14e561");
    g.drawCircle(i * GRID_SIZE + 28 , (-(ai * GRID_SIZE)) + STAGE_HEIGHT/2, 5);
    drawings.push(circle);
    stage.addChild(circle);
  }
  stage.update();
}

function update() {
  stage.update();
}

//////////////////////// PRELOADJS FUNCTIONS
var grid;

/*
 * Add files to be loaded here.
 */
function setupManifest() {
  manifest = [
    {
      src: "../../images/grid.png",
      id: "grid"
    }
  ];
}

function startPreload() {
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

/*
 * Specify how to load each file.
 */
function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
    if (event.item.id == "grid") {
      grid = new createjs.Bitmap(event.result);
    }

}

function loadError(evt) {
    console.log("Error!", evt.text);
}

// not currently used as load time is short
function handleFileProgress(event) {

}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    // ticker calls update function, set the FPS
    createjs.Ticker.setFPS(24);
    createjs.Ticker.addEventListener("tick", update); // call update function

    stage.update();
    initGraphics();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS
