require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();


app.get('/', async(req , res )=>{
    return res.status(200).json({msg: "Hi from server"});
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});