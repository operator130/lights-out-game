import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

class Board extends Component {
  static defaultProps = {
    // number of rows
    nrows: 5,
    // number of columns
    ncols: 5,
    // random chance of light being "on" at start
    chanceLightStartsOn: 0.25,
  };

  constructor(props) {
    super(props);

    this.state = {
      // hasWon: boolean, true when board is all "off"
      hasWon: false,
      board: this.createBoard(),
    };
  }

  createBoard() {
    let board = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }
    return board;
  }

  // handle changing a cell: update board and determine if winner
  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }
    //flip initial cell
    flipCell(y, x);

    //flip this cell and the cells around it
    flipCell(y, x + 1); //flip right
    flipCell(y, x - 1); //flip left
    flipCell(y + 1, x); //flip above
    flipCell(y - 1, x); //flip below

    // win when every cell is turned "off"
    let hasWon = board.every((row) => row.every((cell) => !cell));

    this.setState({ board: board, hasWon: hasWon });
  }

  makeTable() {
    let tblBoard = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            key={coord}
            isLit={this.state.board[y][x]}
            flipCellsAroundMe={() => this.flipCellsAround(coord)}
          />
        );
      }
      tblBoard.push(<tr key={y}>{row}</tr>);
    }
    return (
      <table className="Board">
        <tbody>{tblBoard}</tbody>
      </table>
    );
  }

  // render either winner or the board
  render() {
    return (
      <div>
        {this.state.hasWon ? (
          <div className="winner">
            <span className="neon-orange">YOU</span>
            <span className="neon-blue">WIN!</span>
          </div>
        ) : (
          <div>
            <div className="Board-title">
              <div className="neon-orange">Lights</div>
              <div className="neon-blue">Out</div>
            </div>
            {this.makeTable()}
          </div>
        )}
      </div>
    );
  }
}

export default Board;
