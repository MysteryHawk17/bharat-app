const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();
const bodyParser = require("body-parser");

//routes imports
const templeRoutes=require("./routes/templeRoutes")
const deityRoutes=require("./routes/deityRoutes");
const literatureRoutes=require("./routes/literatureRoutes");
const mandirRoutes=require("./routes/mandirRoutes");
const tyoharRoutes=require("./routes/tyoharRoutes");
const aradhanaRoutes=require("./routes/aradhanaRoutes");
const authRoutes=require("./routes/authRoutes")
const userRoutes=require("./routes/userRoutes")
const communityRoutes=require("./routes/communityRoutes");
const postRoutes=require("./routes/postRoutes");
const chatsRoutes=require("./routes/chatsRoutes");
//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(
    cors({
        origin: '*'
    })
);

//route middlewares
app.use("/api/temple",templeRoutes);
app.use("/api/deity",deityRoutes);
app.use('/api/literature',literatureRoutes);
app.use("/api/mandir",mandirRoutes);
app.use("/api/tyohar",tyoharRoutes);
app.use("/api/aradhana",aradhanaRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes)
app.use("/api/community",communityRoutes);
app.use("/api/posts",postRoutes)
app.use("/api/chats",chatsRoutes)


//server test route
app.get("/", (req, res) => {
    res.status(200).json({ message: "bharat-App server is running" })

})
//connection to database
connectDB(process.env.MONGO_URI);

//server listenng 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

