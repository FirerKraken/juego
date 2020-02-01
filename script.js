const WIDTH = 400;
const HEIGHT = 300;
const TILE_SIZE = 32;

let ctx;

let tiles, enemies, dwarf;

let map = [
  [0,   1,  1,   1,  1,  1,  1,  1,  1, 0, 10],
  [16, 17, 17,  17, 17, 17, 17, 17, 17, 16, 26],
  [16, 17, 17,  17, 17, 17, 17, 17, 17, 16, 26],
  [16, 17, 17,  17, 17, 17, 17, 17, 17, 16, 26],
  [16, 17, 17,  17, 17, 17, 17, 17, 17, 16, 42],
  [16, 17, 17,  17, 17, 17, 17, 17, 17, 16, 48],
  [32, 33, 33,  33, 33, 33, 33, 33, 33, 32, 33],
  [208, 208, 208, 208, 209, 210, 211, 208, 208, 208, 208],
  [224, 224, 224, 224, 225, 226, 227, 224, 224, 224, 224]
];

let props = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 61,0],
  [0, 0, 0, 0, 0, 0, 0, 0, 5, 61,0],
  [0, 0, 0, 0, 0, 0, 0, 0, 21, 61,0],
  [0, 0, 0, 0, 0, 0, 0, 0, 61, 61,0],
  [0, 0, 0, 0, 0, 0, 0, 0, 61, 61,0],
  [0, 0, 0, 0, 0, 0, 0, 0, 61, 77,0],
  [0, 0, 0, 0, 0, 0, 0, 0, 61, 0,0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0],
]

let lastRefresh = 0;

function getCanvasContext(){
  // get element -- getElementById
  let canvas = document.getElementById("canvas");
  let dpr = window.devicePixelRatio || 1;
  
  canvas.width = WIDTH * dpr;
  canvas.height = HEIGHT * dpr;
  
  // get 2d context - getContext
  ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr); 
  ctx.imageSmoothingEnabled = false
}

function loadAssets() {
  tiles = new Image();
  tiles.src = 'https://cdn.glitch.com/af16cf14-1720-46d1-ab6d-cfe1c2a490b0%2Fsewer2x.png?v=1580555366755';
  
  enemies = new Image();
  enemies.src = 'https://cdn.glitch.com/af16cf14-1720-46d1-ab6d-cfe1c2a490b0%2Fcritters.png?v=1579945607002';
  
  dwarf = new Image();
  dwarf.src ='https://cdn.glitch.com/af16cf14-1720-46d1-ab6d-cfe1c2a490b0%2Fdwarf.png?v=1580559174927';
}

/***************************
 * ENTRY POINT
 ***************************/
function init() {
  
  console.log('Ready');
  
  // Get a canvas context
  getCanvasContext();
  
  
  
  document.addEventListener('keypress', function(e) {
    console.log(e.key); 
    
    if(e.key === 'a' ){
      dwarfCol = dwarfCol - 1; 
    }
    if(e.key === 'd' ){
      dwarfCol = dwarfCol + 1; 
    }
    if(e.key === 'w' ){
      dwarfRow = dwarfRow - 1; 
    }
    if(e.key === 's' ){
      dwarfRow = dwarfRow + 1; 
    }
  })
  
  requestAnimationFrame(loop)
  
}

let x = 68
let timeSinceLastFrameChange = 0

function drawLamp(delta){
  timeSinceLastFrameChange = timeSinceLastFrameChange + delta;
  drawTileNum(x, 5, 10)
  
  if(timeSinceLastFrameChange>150){
    x = x + 1;
    timeSinceLastFrameChange = 0
  }                               
  
  if(x > 70){
    x = 68
  }
}

let c = 0;
let t = 0;
let dwarfRow = 5
let dwarfCol = 0
function drawCharacter(delta){
  t = t + delta
  drawDwarf(0, c, dwarfRow, dwarfCol);
  if(t > 100){
    c = c + 1;
    t = 0
  }
  if(c > 4){
    c = 0 
  }
}
function loop(time){
  let delta = time - lastRefresh;
  
  ctx.clearRect(0,0,WIDTH, HEIGHT);
  
  drawMap();
  drawProps();
  drawLamp(delta);
  drawCharacter(delta);
  
  requestAnimationFrame(loop);
  
  lastRefresh = time;
}

function drawMap()  {
  for(let r = 0; r < map.length; r = r + 1) { 
    for(let c = 0; c < map[0].length ; c = c + 1) {
      let tile = map[r][c];
      let sr = getTileRow(tile);
      let sc = getTileCol(tile);

      drawTile(sr, sc, r, c);
    }
  }
}

function drawProps()  {
  for(let r = 0; r < props.length; r = r + 1) { 
    for(let c = 0; c < props[0].length ; c = c + 1) {
      let tile = props[r][c];
      
      if(tile > 0){
        let sr = getTileRow(tile);
        let sc = getTileCol(tile);
        drawTile(sr, sc, r, c);          
      }
    }
  }
}

function getTileRow(tile){
  return Math.floor(tile / 16);
}

function getTileCol(tile){
  return tile % 16;
}

function drawTileNum(n, dr, dc) {
  let r = getTileRow(n);
  let c = getTileCol(n);
  drawTile(r, c, dr, dc) 
}

function drawDwarf(sr, sc, dr, dc) {
  ctx.drawImage(dwarf, 
                sc * TILE_SIZE, sr * TILE_SIZE, TILE_SIZE, TILE_SIZE, 
                dc * TILE_SIZE, dr * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawTile(sr, sc, dr, dc) {
  ctx.drawImage(tiles, 
                sc * TILE_SIZE, sr * TILE_SIZE, TILE_SIZE, TILE_SIZE, 
                dc * TILE_SIZE, dr * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}


window.onload = () => {
  loadAssets();
  setTimeout(init, 1000);
}

