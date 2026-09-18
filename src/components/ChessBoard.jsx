import React from 'react';
import ChessPiece from './ChessPiece';
import './ChessBoard.css';

const ChessBoard = ({ board, selectedPiece, validMoves, onSquareClick }) => {
  const renderSquare = (row, col) => {
    const piece = board[row][col];
    const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
    const isValidMove = validMoves.some(move => move.row === row && move.col === col);
    const isLightSquare = (row + col) % 2 === 0;
    
    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isLightSquare ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid-move' : ''}`}
        onClick={() => onSquareClick(row, col)}
      >
        {piece && <ChessPiece piece={piece} />}
        {isSelected && <div className="selection-indicator" />}
        {isValidMove && !isSelected && <div className="valid-move-indicator" />}
      </div>
    );
  };

  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        squares.push(renderSquare(row, col));
      }
    }
    return squares;
  };

  return (
    <div className="chess-board">
      <div className="board-labels top">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <div key={letter} className="label">{letter}</div>
        ))}
      </div>
      <div className="board-container">
        <div className="board-labels left">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(number => (
            <div key={number} className="label">{number}</div>
          ))}
        </div>
        <div className="board-grid">
          {renderBoard()}
        </div>
        <div className="board-labels right">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(number => (
            <div key={number} className="label">{number}</div>
          ))}
        </div>
      </div>
      <div className="board-labels bottom">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <div key={letter} className="label">{letter}</div>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard; 