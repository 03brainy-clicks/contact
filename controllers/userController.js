const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST api/users/register (public)
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userAvilable = await Users.findOne({ email });
  if (userAvilable) {
    res.status(400);
    throw new Error("User already registed");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const user = await Users.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      message: "User created successfully",
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

// POST api/users/login (public)
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await Users.findOne({ email });

  //   compair password with hash password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password is not valid");
  }
});

// GET api/users/current (private)
const currentUser = asyncHandler(async (req, res, next) => {
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
