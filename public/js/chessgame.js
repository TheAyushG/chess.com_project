const socket = io(); //connect to backend, send request to backend to connect to socket.io server when the page loads or user opens the page
const chess = new chess();
const boardElement = document.querySelector(".chessboard");

//these are variables to store the current state of the game
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {};

const handleMove = () => {};

const getPieceUnicode = () => {};


// socket.emit("churan");

// socket.on("churan paapdi", function (){
//     console.log("churan paapdi recieved");
// });