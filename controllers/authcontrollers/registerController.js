 import authUser from '../../models/authSchema.js';

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    return next(error);
  }

  if (password !== confirmPassword) {
    const error = new Error("Passwords do not match");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const existingUser = await authUser.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      return next(error);
    }

    const user = await authUser.create(req.body);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Registered successfully. Please log in",
      user,
    });
  } catch (error) {
    next(error);
  }
};
