import User from "../../models/user.models.js";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/forgetpassEmail.utils.js";
import crypto from "crypto";

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "⚠️ Please enter your email",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 404,
        message: "🔍 Account not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;

    const html = `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html,
    });

    return res.status(200).json({
      success: true,
      message: "📧 Password reset link sent to your email",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      code: 500,
      message: "🚨 Something went wrong. Please try again later.",
    });
  }
};



const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "⚠️ Please enter a new password",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "⏳ Reset link is invalid or expired",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "✅ Password reset successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: "🚨 Something went wrong. Please try again later.",
    });
  }
};

export { forgetPassword, resetPassword };
