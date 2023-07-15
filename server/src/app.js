import express from "express";


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (req, res)=>{
    res.send("Hi! You are at wrong route. Please, Check it.")
})

app.all("*", (req, res)=>{
    return res.status(404).json({
        success: false,
        message: "You are at wrong route"
    })
})

export default app;