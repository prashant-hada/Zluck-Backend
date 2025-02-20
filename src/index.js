require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const UserAuthRouter = require("./routes/userAuthRoute")
const BookRouter = require("./routes/bookRoute")
const LoanRouter = require("./routes/loanRoutes")

const app = express();

// Security Middleware
app.use(helmet());

// Logging Middleware
app.use(morgan("dev"));

app.use(cors());

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async(req , res )=>{
    return res.status(200).json({msg: "Hi from server"});
})


//user routes
app.use("/user", UserAuthRouter);

//Book Routes
app.use('/book',BookRouter);

//Loan Routes
app.use('/loan', LoanRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});