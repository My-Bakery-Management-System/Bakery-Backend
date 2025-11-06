import authUser from '../../models/authSchema.js';

import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await authUser.findOne({ email });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await user.comparePassword(user.password, password);

    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};
