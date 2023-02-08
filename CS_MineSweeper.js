// 2D array to create 8x8 tile
var board = [];
var rows = 20;
var colonms = 20;

var minesCount = 25;
var mineLocation = []; //"3-4","1-1","7-8"

//goal to click all the tile exc the one with a bomb
var tileClicked = 0;
var flagEnabled = false;

var gameOver = false;

//By default, it is fired when the entire page loads, including its content (images, CSS, scripts, etc.)
// a function to start the game
window.onload = function () {
  startGame();
};

//put the location of the bomb by default
function setMines() {
  // mineLocation.push("2-2");
  // mineLocation.push("2-3");
  // mineLocation.push("5-6");
  // mineLocation.push("3-4");
  // mineLocation.push("1-1");

  //mine generate by itself with while loop,found it on StackOverflow
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * colonms);
    let id = r.toString() + "-" + c.toString();

    if (!mineLocation.includes(id)) {
      mineLocation.push(id);
      minesLeft -= 1;
    }
  }
}

function startGame() {
  document.getElementById("mines-count").innerText = minesCount;
  document.getElementById("flag-button").addEventListener("click", setFlag);
  setMines();
  // create the tiles for the board
  for (let r = 0; r < rows; r++) {
    //create 8 rows
    let row = [];
    for (let c = 0; c < colonms; c++) {
      //we create colonms
      //<div id="0-0"><div>
      let tile = document.createElement("div");
      //the number of row - colomn
      tile.id = r.toString() + "-" + c.toString();
      //make the box clickable by calling clickTile function
      tile.addEventListener("click", clickTile);
      //do the docs
      document.getElementById("board").append(tile);
      //push the tile into the array
      row.push(tile);
    }
    //push the row into the board
    board.push(row);
  }
  //cout the board
  console.log(board);
}

//change the flag button when click
function setFlag() {
  if (flagEnabled) {
    flagEnabled = false;
    document.getElementById("flag-button").style.backgroundColor = "lightgray";
  } else {
    flagEnabled = true;
    document.getElementById("flag-button").style.backgroundColor = "darkgray";
  }
}

//make the box clickable
function clickTile() {
  //if you win or lose the game, you can't click anywhere else
  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }
  let tile = this;
  if (flagEnabled) {
    //if it hasn't been click yet
    if (tile.innerText == "") {
      tile.innerText = "🚩";
    } else if (tile.innerText == "🚩") {
      tile.innerText = "";
    }
    return;
  }
  //if the user click on the bomb location,display Game Over
  if (mineLocation.includes(tile.id)) {
    // alert("GAME OVER");
    gameOver = true;
    //call the reveal function that shows the Mines after game over
    revealMines();
    return;
  }

  //if we didnt hit the bomb,we want to know how many bomb near by
  let coords = tile.id.split("-"); //"0-0" => ["0","0"]
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
}
//function that reveal the bomb after game over
function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < colonms; c++) {
      let tile = board[r][c];
      if (mineLocation.includes(tile.id)) {
        tile.innerText = "💣";
        tile.style.backgroundColor = "red";
      }
    }
  }
}
//the number on each tile to check if it touch the bomb
function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= colonms) {
    return;
  }
  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }
  board[r][c].classList.add("tile-clicked");
  tileClicked += 1;
  let mineFound = 0;
  //check the top 3
  mineFound += checkTile(r - 1, c - 1); //top left
  mineFound += checkTile(r - 1, c); //top
  mineFound += checkTile(r - 1, c + 1); //top right

  //check the left and right
  mineFound += checkTile(r, c - 1);
  mineFound += checkTile(r, c + 1);

  //button 3
  mineFound += checkTile(r + 1, c - 1); //buttom left
  mineFound += checkTile(r + 1, c); //buttom
  mineFound += checkTile(r + 1, c + 1); //buttom right

  if (mineFound > 0) {
    board[r][c].innerText = mineFound;
    //change the number of the tile in css
    board[r][c].classList.add("x" + mineFound.toString());
  }
  //ask the next box to check for the box that touch the bomb
  else {
    //top 3
    checkMine(r - 1, c - 1); //top left
    checkMine(r - 1, c); //top
    checkMine(r - 1, c + 1); //top right

    checkMine(r, c - 1); //top left
    checkMine(r, c + 1); //top

    checkMine(r + 1, c - 1); //buttom left
    checkMine(r + 1, c); //buttom
    checkMine(r + 1, c + 1); //buttom right
  }
  //check if we found all the box except the bomb, we won the game
  if (tileClicked == rows * colonms - minesCount) {
    document.getElementById("mines-count").innerText = "Cleared";
    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= colonms) {
    return 0;
  }
  if (mineLocation.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}
