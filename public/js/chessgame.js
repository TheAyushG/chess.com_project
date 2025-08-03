

const socket = io(); //connect to backend, send request to backend to connect to socket.io server when the page loads or user opens the page
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

//these are variables to store the current state of the game
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board(); //it creates all the things like dimentions, squares, pieces, etc. for the chessboard
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => { //board is a 2d array, so we are iterating over each row and each square in the row
        row.forEach((square, squareIndex) =>{
            const squareElement = document.createElement("div"); //we are creating a div for each square, creating boxs for each piece
            squareElement.classList.add(   //we are creating a pattern of chessboard, so we are adding classes to the squareElement
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if(square) { //all the squares that are not null, we will add the piece to that square
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black",
                );
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color; //if the player is white, then only white pieces can be dragged, same for black pieces
                

                pieceElement.addEventListener("dragstart", (e) => {
                    if(pieceElement.draggable){
                        draggedPiece = pieceElement;
                        sourceSquare = {row: rowIndex, col: squareIndex};
                        e.dataTransfer.setData("text/plain", "");
                    }
                });
                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                });
                squareElement.appendChild(pieceElement); //we are appending the pieceElement to the squareElement
            }


            squareElement.addEventListener("dragover", (e) => { //we are adding event listeners to the squareElement to handle the drag and drop functionality
                e.preventDefault();  // we prevent drag if we darg random or not allowed piece
            });


            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if(draggedPiece) {
                    const targetSquare = {
                        row: parseInt(this.dataset.row),
                        col: parseInt(this.dataset.col),
                    };
                handleMove(sourceSquare, targetSquare); //handle move from source square to target square
                }
            })
            boardElement.appendChild(squareElement); //we are appending the squareElement to the boardElement
        });
    });

    if(playerRole === 'b') {
        boardElement.classList.add('flipped');
    }

    else {
        boardElement.classList.remove('flipped');
    }
};


const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q",
    };
    socket.emit("move", move);
};



const getPieceUnicode = (piece) => {
    
    if (!piece || !piece.type || !piece.color) return "";
    const unicodepieces = {
        w: { // white pieces
            p: "♙",
            r: "♖",
            n: "♘",
            b: "♗",
            q: "♕",
            k: "♔"
        },

        b: { // black pieces
            p: "♟",
            r: "♜",
            n: "♞",
            b: "♝",
            q: "♛",
            k: "♚"
        }
    };
    return unicodepieces[piece.color][piece.type] || "";
};

socket.on("playerRole", function(role) {
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole", function() {
    playerRole = null;
    renderBoard();
});

socket.on("boardState", function(fen) {
    chess.load(fen);
    renderBoard();
});

socket.on("move", function(move) {
    chess.move(move);
    renderBoard();
});

renderBoard();

// socket.emit("churan");

// socket.on("churan paapdi", function (){
//     console.log("churan paapdi recieved");
// });