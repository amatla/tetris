const ROW = 20;
const COL = 10;
const SQ = 20;
const EMPTY = '#b5b4b0';
const FULL = 'red';
const STROKE = 'black';
const cvs = document.getElementById('tetris');
const ctx = cvs.getContext('2d');
let board = [];
let gameOver = false;
let score = 0;
const PIECES = [
  [Z, 'red'],
  [S, 'green'],
  [T, 'yellow'],
  [O, 'blue'],
  [L, 'purple'],
  [I, 'cyan'],
  [J, 'orange'],
];
const scoreElement = document.getElementById('score');
/** Draw a square given coordinates and color */
function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
  ctx.strokeStyle = STROKE;
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

/** Initialize an empty board */
function initializeBoard() {
  for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
      board[r][c] = EMPTY;
    }
  }
}
/** Draw the board */
function drawBoard() {
  for (let r = 0; r < ROW; r++) {
    for (let c = 0; c < COL; c++) {
      drawSquare(c, r, board[r][c]);
    }
  }
}

/** Generate random piece */
function randomPiece() {
  let r = Math.floor(Math.random() * PIECES.length);
  return new Piece(PIECES[r][0], PIECES[r][1]);
}

/** Piece Object */
function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;
  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];
  this.x = 3;
  this.y = -2;
}

/** Piece method to fill itself with a color */
Piece.prototype.fill = function (color) {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      if (this.activeTetromino[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
};

/** Piece method to draw itself */
Piece.prototype.draw = function () {
  this.fill(this.color);
};

/** Piece method to undraw itself */
Piece.prototype.unDraw = function () {
  this.fill(EMPTY);
};

/** Piece method to move itself down */
Piece.prototype.moveDown = function () {
  if (!this.collision(0, 1, this.activeTetromino)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
    p = randomPiece();
  }
};

/** Piece method to move right */
Piece.prototype.moveRight = function () {
  if (!this.collision(1, 0, this.activeTetromino)) {
    this.unDraw();
    new Piece(PIECES[0][0], PIECES[0][1]);
    this.x++;
    this.draw();
  }
};
/** Piece method to move left */
Piece.prototype.moveLeft = function () {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    this.unDraw();
    this.x--;
    this.draw();
  }
};

/** Piece method to move rotate itself*/
Piece.prototype.rotate = function () {
  let nextPattern = this.tetromino[
    (this.tetrominoN + 1) % this.tetromino.length
  ];
  let kick = 0;

  if (this.collision(0, 0, nextPattern)) {
    if (this.x > COL / 2) {
      // right wall
      kick = -1;
    } else {
      // left wall
      kick = 1;
    }
  }
  if (!this.collision(kick, 0, nextPattern)) {
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
};

/** Lock function */
Piece.prototype.lock = function () {
  for (let r = 0; r < this.activeTetromino.length; r++) {
    for (let c = 0; c < this.activeTetromino.length; c++) {
      // skip vacant squares
      if (!this.activeTetromino[r][c]) continue;
      // if piece locks on top of the board = game over
      if (this.y + r < 0) {
        alert('Game Over!');
        gameOver = true;
        break;
      }
      // lock piece
      board[this.y + r][this.x + c] = this.color;
    }
  }
  // remove full rows
  for (r = 0; r < ROW; r++) {
    let isRowFull = true;
    for (c = 0; c < COL; c++) {
      isRowFull = isRowFull && board[r][c] != EMPTY;
    }
    if (isRowFull) {
      //move all row above down
      for (y = r; y > 1; y--) {
        for (c = 0; c < COL; c++) {
          board[y][c] = board[y - 1][c];
        }
      }
      for (c = 0; c < COL; c++) {
        board[0][c] = EMPTY;
      }
      // increment score
      score += 10;
    }
  }
  // update board
  drawBoard();
  scoreElement.innerHTML = score;
};

/**  Piece collisiont detection */
Piece.prototype.collision = function (x, y, piece) {
  for (let r = 0; r < piece.length; r++) {
    for (let c = 0; c < piece.length; c++) {
      if (!piece[r][c]) continue;

      // coordinates after movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;

      // conditions
      // borders
      if (newX < 0 || newX >= COL || newY >= ROW) return true;
      if (newY < 0) continue;
      // another piece already locked
      if (board[newY][newX] != EMPTY) return true;
    }
  }
  return false;
};

/** Piece controls */
document.addEventListener('keydown', CONTROL);

function CONTROL(event) {
  if (event.keyCode == 65) {
    p.moveLeft();
  } else if (event.keyCode == 87) {
    p.rotate();
  } else if (event.keyCode == 68) {
    p.moveRight();
  } else if (event.keyCode == 83) {
    p.moveDown();
  }
}

/** Drop the piece every 1 second */
function drop() {
  let now = Date.now();
  let delta = now - dropStart;
  if (delta > 1000) {
    p.moveDown();
    dropStart = Date.now();
  }
  if (!gameOver) requestAnimationFrame(drop);
}

let dropStart = Date.now();
initializeBoard();
drawBoard();
let p = randomPiece();
p.draw();
drop();
