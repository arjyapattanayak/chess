import React from 'react';
import './ChessPiece.css';

const ChessPiece = ({ piece }) => {
  const getPieceSymbol = (type, color) => {
    const symbols = {
      king: { white: '♔', black: '♚' },
      queen: { white: '♕', black: '♛' },
      rook: { white: '♖', black: '♜' },
      bishop: { white: '♗', black: '♝' },
      knight: { white: '♘', black: '♞' },
      pawn: { white: '♙', black: '♟' }
    };
    
    return symbols[type]?.[color] || '?';
  };

  return (
    <div className={`chess-piece ${piece.color}`}>
      {getPieceSymbol(piece.type, piece.color)}
    </div>
  );
};

export default ChessPiece; 