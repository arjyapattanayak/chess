import React, { useState } from 'react';
import ChessBoard from './components/ChessBoard';
import GameInfo from './components/GameInfo';
import './App.css';

function App() {
  const [gameState, setGameState] = useState({
    board: initializeBoard(),
    currentPlayer: 'white',
    selectedPiece: null,
    gameOver: false,
    winner: null,
    moveHistory: []
  });

  const handleSquareClick = (row, col) => {
    if (gameState.gameOver) return;

    const piece = gameState.board[row][col];
    
    // If no piece is selected and clicked square has a piece of current player
    if (!gameState.selectedPiece && piece && piece.color === gameState.currentPlayer) {
      setGameState(prev => ({
        ...prev,
        selectedPiece: { row, col, piece }
      }));
      return;
    }

    // If a piece is selected
    if (gameState.selectedPiece) {
      const { row: selectedRow, col: selectedCol, piece: selectedPiece } = gameState.selectedPiece;
      
      // If clicking on the same piece, deselect it
      if (selectedRow === row && selectedCol === col) {
        setGameState(prev => ({
          ...prev,
          selectedPiece: null
        }));
        return;
      }

      // If clicking on a piece of the same color, select the new piece
      if (piece && piece.color === gameState.currentPlayer) {
        setGameState(prev => ({
          ...prev,
          selectedPiece: { row, col, piece }
        }));
        return;
      }

      // Try to make a move
      if (isValidMove(gameState.board, selectedRow, selectedCol, row, col)) {
        const newBoard = makeMove(gameState.board, selectedRow, selectedCol, row, col);
        const newCurrentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: newCurrentPlayer,
          selectedPiece: null,
          moveHistory: [...prev.moveHistory, {
            piece: selectedPiece.type,
            from: `${String.fromCharCode(97 + selectedCol)}${8 - selectedRow}`,
            to: `${String.fromCharCode(97 + col)}${8 - row}`,
            player: gameState.currentPlayer
          }]
        }));
      }
    }
  };

  // Get valid moves for the selected piece
  const getValidMoves = (selectedPiece) => {
    if (!selectedPiece) return [];
    
    const validMoves = [];
    const { row, col } = selectedPiece;
    
    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(gameState.board, row, col, toRow, toCol)) {
          validMoves.push({ row: toRow, col: toCol });
        }
      }
    }
    
    return validMoves;
  };

  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      currentPlayer: 'white',
      selectedPiece: null,
      gameOver: false,
      winner: null,
      moveHistory: []
    });
  };

  return (
    <div className="app">
      <div className="chess-game">
        <h1>Chess Game</h1>
        <div className="game-container">
          <ChessBoard 
            board={gameState.board}
            selectedPiece={gameState.selectedPiece}
            validMoves={getValidMoves(gameState.selectedPiece)}
            onSquareClick={handleSquareClick}
          />
          <GameInfo 
            currentPlayer={gameState.currentPlayer}
            moveHistory={gameState.moveHistory}
            onReset={resetGame}
            selectedPiece={gameState.selectedPiece}
            validMovesCount={getValidMoves(gameState.selectedPiece).length}
          />
        </div>
      </div>
    </div>
  );
}

// ! check 
consoleee.log("It is running")

// Initialize the chess board with pieces in their starting positions
function initializeBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[6][col] = { type: 'pawn', color: 'white' };
    board[1][col] = { type: 'pawn', color: 'black' };
  }

  // Set up other pieces
  const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  pieces.forEach((piece, col) => {
    board[7][col] = { type: piece, color: 'white' };
    board[0][col] = { type: piece, color: 'black' };
  });

  return board;
}

// Check if a move is valid (simplified version)
function isValidMove(board, fromRow, fromCol, toRow, toCol) {
  const piece = board[fromRow][fromCol];
  const targetPiece = board[toRow][toCol];
  
  // Can't capture your own piece
  if (targetPiece && targetPiece.color === piece.color) {
    return false;
  }

  // Basic validation for different piece types
  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(board, fromRow, fromCol, toRow, toCol, piece.color);
    case 'rook':
      return isValidRookMove(board, fromRow, fromCol, toRow, toCol);
    case 'knight':
      return isValidKnightMove(fromRow, fromCol, toRow, toCol);
    case 'bishop':
      return isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
    case 'queen':
      return isValidQueenMove(board, fromRow, fromCol, toRow, toCol);
    case 'king':
      return isValidKingMove(fromRow, fromCol, toRow, toCol);
    default:
      return false;
  }
}

function isValidPawnMove(board, fromRow, fromCol, toRow, toCol, color) {
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  
  // Forward move
  if (fromCol === toCol && toRow === fromRow + direction && !board[toRow][toCol]) {
    return true;
  }
  
  // Initial two-square move
  if (fromCol === toCol && fromRow === startRow && toRow === fromRow + 2 * direction && 
      !board[fromRow + direction][fromCol] && !board[toRow][toCol]) {
    return true;
  }
  
  // Diagonal capture
  if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && board[toRow][toCol]) {
    return true;
  }
  
  return false;
}

function isValidRookMove(board, fromRow, fromCol, toRow, toCol) {
  if (fromRow !== toRow && fromCol !== toCol) return false;
  
  const rowStep = fromRow === toRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
  const colStep = fromCol === toCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);
  
  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;
  
  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return true;
}

function isValidKnightMove(fromRow, fromCol, toRow, toCol) {
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(board, fromRow, fromCol, toRow, toCol) {
  if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
  
  const rowStep = (toRow - fromRow) / Math.abs(toRow - fromRow);
  const colStep = (toCol - fromCol) / Math.abs(toCol - fromCol);
  
  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;
  
  while (currentRow !== toRow && currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return true;
}

function isValidQueenMove(board, fromRow, fromCol, toRow, toCol) {
  return isValidRookMove(board, fromRow, fromCol, toRow, toCol) || 
         isValidBishopMove(board, fromRow, fromCol, toRow, toCol);
}

function isValidKingMove(fromRow, fromCol, toRow, toCol) {
  return Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1;
}

// Make a move on the board
function makeMove(board, fromRow, fromCol, toRow, toCol) {
  const newBoard = board.map(row => [...row]);
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;
  return newBoard;
}

export default App;
