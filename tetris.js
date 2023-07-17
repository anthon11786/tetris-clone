const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20); // Scales everything in the context 20x 


// Check if rows are completed 
function arenaSweep() {
  let rowCount = 1; 
  outer: for (let y = arena.length -1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; ++x) {
      // Check if any of rows have a zero, if it does not fully complete then
      if (arena[y][x] === 0) {
        continue outer; 
      }

    }
    const row = arena.splice(y, 1)[0].fill(0); // takes rows out of arena, and fills it with 0 
    arena.unshift(row); // append empty row to the top
    y++; 
    
    player.score += rowCount*10; 
    rowCount *= 2; 
  }
}


// Data structures for tetrinemos 
const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],

]

function collide(arena, player) {
  const [matrix, offset] = [player.matrix, player.pos]; 
  // iterating over the player 
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[y].length; ++x) {
      if (matrix[y][x] !== 0 && (arena[y + offset.y] && arena[y + offset.y][x + offset.x]) !== 0 ){
        // collision detected 
        // conditions -> cell has to be a '1' not '0' 
        // the row has to exist in the 'arena' and
        return true;
      }

    }
  }
  return false; 
}

function createMatrix(width, height){
  const matrix = [];

  while (height--) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

// 
function createPiece(type) {
  if (type === 'T') {
    return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0], 
      ];
  } else if (type === 'O'){
      return [
          [2, 2],
          [2, 2],
      ];
  } else if (type === 'L') {
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3], 
      ]
  } else if (type === 'J') {
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0], 
      ]
  } else if (type === 'I'){
      return [
        [0, 5, 0],
        [0, 5, 0],
        [0, 5, 0], 
        [0, 5, 0], 
      ]
  } else if (type === 'S') {
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0], 
      ]
  } else if (type === 'Z'){
    return [ 
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0], 
    ]
  }
}

 

function clearCanvas() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function draw() { 
  
  // Clear canvas before you draw anything new 
  clearCanvas();

  const shadowPos = { 
    x: player.pos.x, 
    y: player.pos.y
  };

  // // Move showd downward until it collides 
  // while (!collide(arena, {matrix: player.matrix, pos: shadowPos })) {
  //   shadowPos.y++; 
  // }
  // shadowPos.y--;
  shadowPos.y = calculateShadow(shadowPos, arena)
  // Draw the shadow tetromino with a diff color 
  drawMatrix(player.matrix, shadowPos, "#888");

  // Draw active tetromino
  drawMatrix(player.matrix, player.pos)

  drawMatrix(arena, {x: 0, y: 0}); //Draw the saved pieces on board 
}

function calculateShadow(shadowPos, arena) {
    // Move showd downward until it collides 
    while (!collide(arena, {matrix: player.matrix, pos: shadowPos })) {
      shadowPos.y++; 
    }
    shadowPos.y--;
    return shadowPos.y; 
}

function drawMatrix(matrix, offset, color = null) {
  matrix.forEach((row, y ) => {
    row.forEach((value, x) => {
      if (value !== 0){
          context.fillStyle = color ? color: colors[value];
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function playerDrop() {
  player.pos.y++;

  if (collide(arena, player)) {
    player.pos.y--; // it will collide so we move it right back where it touches and not overlaps. 
    merge(arena, player); // save the tetrimino where it collided  
    playerReset();
    arenaSweep();
    updateScore(); 
  }

  dropCounter = 0; // we dont want another drop we want that delay  
}


// Saves the current spot of the tetrimino into the gameboard 
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    })
  })
}




// Rotation mechanics 
function rotate(matrix, dir) {
  // Special check for rotation with 'I' piece because its a 4x3 matrix
  normal =[
        [0, 5, 0],
        [0, 5, 0],
        [0, 5, 0], 
        [0, 5, 0], 
      ];
  I_rotated = [
    [5, 5, 5, 5], 
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0], 
    
  ];
  normal_check = JSON.stringify(normal);
  I_rotated_check = JSON.stringify(I_rotated);
  check_matrix = JSON.stringify(matrix);
  if (check_matrix === normal_check) {
    player.matrix = I_rotated;
    return 
  } else if (check_matrix === I_rotated_check) {
    player.matrix = normal;
    return 
  }

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [ matrix[x][y], matrix[y][x]] = [ matrix[y][x], matrix[x][y]];
      

    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse())
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1; 

  rotate(player.matrix, dir)
  while (collide(arena, player)) {
    // move piece left and right checking its clear 
    // if collide move player offset 
    player.pos.x += offset; 
    offset = -(offset) + (offset > 0 ? 1: -1)
    if (offset > player.matrix[0].length) {
      print('offst is greater than player matrix length')
      rotate(player.matrix, -dir);
      player.pos.x; 
      return; 
    }

  }
}

function playerMove(dir) {
  player.pos.x += dir; 
  if (collide(arena, player)) { 
    player.pos.x -= dir; 
  }
}

function playerReset() {
  const pieces = 'TJLOSZI'; 
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0; 
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0); 
  if (collide(arena, player)) { 
    arena.forEach(row => row.fill(0))
    player.score = 0; 
    updateScore(); 
  }
}

function playerHardDrop() {
  const shadowPos = { 
    x: player.pos.x, 
    y: player.pos.y
  };
  player.pos.y = calculateShadow(shadowPos, arena);
  // Below is same as playerDrop without the reset of drop counter so no delay 
  // after hitting 'spacebar'
  player.pos.y++;

  if (collide(arena, player)) {
    player.pos.y--; // it will collide so we move it right back where it touches and not overlaps. 
    merge(arena, player); // save the tetrimino where it collided  
    playerReset();
    arenaSweep();
    updateScore(); 
  }

  dropCounter = 0; // we dont want another drop we want that delay  

}

// #####################################################
// Main Update function

let dropCounter = 0; 
let dropInterval = 1000; //every second we want to drop piece 

let lastTime = 0; 
function update(time = 0) {
  // requestAnimationFrame gives us a parameter 'time' - total time since page is loaded 
  const deltaTime = time - lastTime;
  lastTime = time;
  
  dropCounter += deltaTime; 
  if (dropCounter > dropInterval) {
    playerDrop(); 
  }

  draw(); 
  requestAnimationFrame(update); // requestAnimationFrame has to have a callback of the same funciton its called in! which is 'update'
}


// ######################### Handle Score ##################

function updateScore() {
  document.getElementById('score').innerHTML = player.score
}

// #########################################################
const arena = createMatrix(12, 20);

const player = {
  pos: {x:0 , y:0 },
  matrix: null, 
  score: 0,
  storedPiece: null, 
}

const colors = [ null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];

// ################### KeyBoard Controls ###################
document.addEventListener('keydown', event => {
  console.log(event)
  if (event.key === 'ArrowLeft') {
    playerMove(-1);
  }
  else if (event.key === 'ArrowDown'){
    playerDrop()
    
  }
  else if (event.key === 'ArrowRight') {
    playerMove(1)
  }
  else if (event.key === 'ArrowUp') {
    playerRotate(1);
  } 
  else if (event.key === ' ') {
    playerHardDrop();
  }
  else if (event.key === 'c') {
    if (player.storedPiece) {
      temp = player.matrix;
      player.matrix = player.storedPiece;  
      player.storedPiece = temp; 
  } else {
      player.storedPiece = player.matrix; 
      //  player.matrix = playerReset();  
      // TODO - implement the store as a player reset so it moves the new piece to top
      const pieces = 'TJLOSZI'; 
      player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  }}
    
})


// Start game 
playerReset(); 
updateScore(); 
update();
