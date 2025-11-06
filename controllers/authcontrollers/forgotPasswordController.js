import authUser from "../../models/authSchema.js";
import { sendMail } from "../../config/sendMail.js";
import crypto from "crypto";

//Forgot Password  //
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await authUser.findOne({ email });

    if (!user) {
      const error = new Error("User with this email does not exist");
      error.statusCode = 400;
      return next(error);
    }

    const resetToken = user.generatePasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;
    const subject = "Password Reset Request";
    const html = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
    `;

    try {
      sendMail({
        to: user.email,
        subject,
        html,
      });

      res.status(200).json({
        success: true,
        message: "Reset link sent to your email successfully",
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      await user.save({ validateBeforeSave: true });
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//Reset Password//
export const resetPassword = async (req, res, next) => {
  const { resetPasswordToken } = req.params;

  try {
    const hashed = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");

    const user = await authUser.findOne({
      resetPasswordToken: hashed,
      resetPasswordTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("The token or link has expired");
      error.statusCode = 400;
      return next(error);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Change Password //
export const changePassword = async (req, res, next) => {
  const { previousPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    const error = new Error("New password and confirmation do not match");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await authUser.findById(req.loggedUser._id);

    const isSame = await user.comparePassword(user.password, previousPassword);

    if (!isSame) {
      const error = new Error("Previous password is incorrect");
      error.statusCode = 400;
      return next(error);
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

//  Check Link //
export const checkLink = async (req, res, next) => {
  try {
    const { token } = req.params;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await authUser.findOne({
      resetPasswordToken: hashed,
      resetPasswordTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("The token or link has expired");
      error.statusCode = 400;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Valid reset link",
    });
  } catch (error) {
    next(error);
  }
};
