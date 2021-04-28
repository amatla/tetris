(function () {
  'use strict';
  const ROW = 10;
  const COL = 20;
  const SQ = 20;
  const EMPTY = 'white';
  const FULL = 'red';
  const STROKE = 'black';
  const cvs = document.getElementById('tetris');
  const ctx = cvs.getContext('2d');
  let board = [];

  function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = STROKE;
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
  }

  function initializeBoard() {
    for (let r = 0; r < ROW; r++) {
      board[r] = [];
      for (let c = 0; c < COL; c++) {
        board[r][c] = EMPTY;
      }
    }
  }

  function drawBoard() {
    for (let r = 0; r < ROW; r++) {
      for (let c = 0; c < COL; c++) {
        drawSquare(r, c, board[r][c]);
      }
    }
  }
  //drawSquare(3, 3, 'red');
  initializeBoard();
  drawBoard();
})();
