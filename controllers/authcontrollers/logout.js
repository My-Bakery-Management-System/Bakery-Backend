export const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
