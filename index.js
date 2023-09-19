const http = require("http");
const path = require("path");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 4500;
app.use(cors());

const users = [{}];



app.get("/", (req, res) => {
    res.send("Hell its working");
})




const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {

    socket.on('joined', ({ user }) => {
        users[socket.id] = user; //jo bhi connect karega uski ek unique id hogi always
        socket.broadcast.emit('userJoined', { user: "Admin", message: `${users[socket.id]} has joined` });
        socket.emit('welcome', { user: "Admin", message: `welcome to the chat,${users[socket.id]}` })
    }) 

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnect',()=>{  
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}, has left`});
    })    


 
});


// app.get('*',(req,res)=>{
//     res.sendFile(path.resolve(__dirname,'build','index.html'))
// })

server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})