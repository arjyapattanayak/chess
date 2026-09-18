import React from 'react';
import './GameInfo.css';

const GameInfo = ({ currentPlayer, moveHistory, onReset, selectedPiece, validMovesCount }) => {
  return (
    <div className="game-info">
      <div className="current-player">
        <h3>Current Player</h3>
        <div className={`player-indicator ${currentPlayer}`}>
          {currentPlayer === 'white' ? '♔ White' : '♚ Black'}
        </div>
      </div>
      
      {selectedPiece && (
        <div className="selected-piece-info">
          <h3>Selected Piece</h3>
          <div className="piece-info">
            <span className="piece-symbol">
              {selectedPiece.piece.color === 'white' ? 
                (selectedPiece.piece.type === 'king' ? '♔' : 
                 selectedPiece.piece.type === 'queen' ? '♕' :
                 selectedPiece.piece.type === 'rook' ? '♖' :
                 selectedPiece.piece.type === 'bishop' ? '♗' :
                 selectedPiece.piece.type === 'knight' ? '♘' : '♙') :
                (selectedPiece.piece.type === 'king' ? '♚' : 
                 selectedPiece.piece.type === 'queen' ? '♛' :
                 selectedPiece.piece.type === 'rook' ? '♜' :
                 selectedPiece.piece.type === 'bishop' ? '♝' :
                 selectedPiece.piece.type === 'knight' ? '♞' : '♟')
              }
            </span>
            <span className="piece-name">{selectedPiece.piece.type.charAt(0).toUpperCase() + selectedPiece.piece.type.slice(1)}</span>
            <span className="valid-moves-count">{validMovesCount} valid moves</span>
          </div>
        </div>
      )}
      
      <div className="move-history">
        <h3>Move History</h3>
        <div className="moves-list">
          {moveHistory.length === 0 ? (
            <p className="no-moves">No moves yet</p>
          ) : (
            moveHistory.map((move, index) => (
              <div key={index} className={`move ${move.player}`}>
                <span className="move-number">{Math.floor(index / 2) + 1}.</span>
                <span className="move-piece">{move.piece}</span>
                <span className="move-coordinates">{move.from} → {move.to}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="game-controls">
        <button className="reset-button" onClick={onReset}>
          Reset Game
        </button>
      </div>
      
      <div className="game-instructions">
        <h3>How to Play</h3>
        <ul>
          <li>Click on a piece to select it (highlighted in blue)</li>
          <li>Valid moves are shown with green indicators</li>
          <li>Click on a green square to move your piece</li>
          <li>White moves first</li>
          <li>Capture pieces by moving to their square</li>
        </ul>
      </div>
    </div>
  );
};

export default GameInfo; 