const express = require('express');
const http = require('http');
const socket = require('socket.io');
const { Chess } = require('chess.js');
const path = require("path");

const app = express(); //this express app handle routing part and middleware all that

const server = http.createServer(app);
const io = socket(server); // these two line for the socket.io to work

const chess = new Chess();
let players = {};
let curentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req,res) => {
    res.render("index", {title: "Chess Game"});
});


io.on("connection", function (uniqueSocket){ //uniqueSocket is unique id that come from frontend,
    //connection request from frontend to backend, this is the first thing that happens when user open the page
    
    console.log("connected");

    if(!players.white){
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "w");
    }
     else if(!players.black){
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "b");
    } else {
        uniqueSocket.emit(spectatorRole);
    }

    uniqueSocket.on("disconnect", function (){
        if(uniqueSocket.id === players.white){
            delete players.white;
        }

        else if(uniqueSocket.id === players.black){
            delete players.black;
        }
    });


    uniqueSocket.on("move", (move) => {
        try{
            if(chess.turn() === "w" && uniqueSocket.id !== players.white) return;
            if(chess.turn() === "b" && uniqueSocket.id !== players.black) return;

            const result = chess.move(move);
            if(result){
                curentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            }
            else{
                console.log("Invalid Move : ", move);
                uniqueSocket.emit("Invalid Move", move);
            }
        }
        catch (error) {
             console.log(error);
             uniqueSocket.emit("Invalid Move:", move);
        }
    })
    // uniqueSocket.on("churan", function(){  //in this line we recieved churan on server from frontend 
    //     io.emit("churan paapdi"); // in this line we send churan paapdi from server to frontend, io.emit means we send churan paapdi to all members of the group
    // })

    // uniqueSocket.on("disconnect", function (){ //for disconnecting the socket, when user leave the page
    //     console.log("disconnected");
    // })
});

server.listen(3000, function(){
    console.log("Server is running on port 3000");
});

