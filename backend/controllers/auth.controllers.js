const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { cookieOptions } = require("../constants");

// Generate token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "12d" });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, adminInviteToken, profileImageURL } =
      req.body;

    console.log(req.body);

    // check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // assign role
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create user and select pass means don't return password
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImageURL,
      role,
    });

    // check if user is created
    if (!user) {
      return res.status(400).json({
        message: "User not created",
      });
    }

    // if created, then remove password from response using .select("-password")
    // const userWithoutPassword = await User.findById(user._id).select(
    //   "-password"
    // ); // but this expensive operation because it fetches user from db again

    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImageURL: user.profileImageURL,
      role: user.role,
    };

    // send response
    return res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while creating user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    // check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // check if password is correct
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    // generate token
    const token = generateToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    // send response
    return res.status(200).cookie("token", token, cookieOptions).json({
      message: "User logged in successfully",
      user: loggedInUser,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while logging in",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message:
        error?.message || "Something went wrong while getting user profile",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // check if user is logged in
    const user = await User.findById(req.user._id);

    // check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
    const { username } = req.body;

    // check if all fields are provided
    if (!username) {
      return res.status(400).json({
        message: "At least one field is required",
      });
    }

    // check if fields are different
    if (username === user.username) {
      return res.status(400).json({
        message: "Field should be different",
      });
    }

    // update user
    // syntax of findByIdAndUpdate is findByIdAndUpdate(id, what i want to update, options like new: true)
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        username: username,
      },
      { new: true }
    ).select("-password");
    // console.log("updatedUser", updatedUser);

    // check if user is updated
    if (!updatedUser) {
      return res.status(400).json({
        message: "User not updated successfully. Please try again",
      });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message:
        error?.message || "Something went wrong while updating user profile",
    });
  }
};

const uploadImage = async (req, res) => {
  // check if user is logged in
  const user = await User.findById(req.user._id);

  // check if user exists
  if (!user) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
  const filename = req.file?.filename;

  if (!filename) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  const fullImagePath = `${req.protocol}://${req.get(
    "host"
  )}/uploads/${filename}`;

  return res.status(200).json({
    message: "Image uploaded successfully",
    profileImageURL: fullImagePath,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadImage,
};
