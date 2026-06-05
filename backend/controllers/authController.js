import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc    Register a new user and generate email verification token
 * @route   POST /auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already registered with this email address'
      });
    }

    // Generate email verification token and expiration (24h)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create the user (unverified by default)
    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires
    });

    // Email simulator log output
    console.log(`\n======================================================================`);
    console.log(`📬 [EMAIL SIMULATOR] Email verification link for ${user.email}:`);
    console.log(`👉 http://127.0.0.1:5000/auth/verify-email (Token: ${verificationToken})`);
    console.log(`======================================================================\n`);

    // In non-production envs, return the token in response to support automated testing.
    const responsePayload = {
      success: true,
      message: 'Registration successful! Please verify your email.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      responsePayload.data.verificationToken = verificationToken;
    }

    res.status(201).json(responsePayload);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * @desc    Verify user email address using token
 * @route   POST /auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const token = req.body.token || req.query.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user by verification token and check expiration
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired email verification token'
      });
    }

    // Update user verification state
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message
    });
  }
};

/**
 * @desc    Authenticate user and get JWT token
 * @route   POST /auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email address before logging in'
      });
    }

    // Generate access token (short-lived, 15m)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'supersecretkey123',
      { expiresIn: '15m' }
    );

    // Generate refresh token (long-lived, 7d)
    const refreshToken = jwt.sign(
      { id: user._id, jti: crypto.randomBytes(24).toString('hex') },
      process.env.JWT_SECRET || 'supersecretkey123',
      { expiresIn: '7d' }
    );

    // Save refresh token to user document
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // Access Token
      refreshToken,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * @desc    Logout user and revoke refresh token
 * @route   POST /auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (refreshToken) {
      await User.updateOne(
        { refreshTokens: refreshToken },
        { $pull: { refreshTokens: refreshToken } }
      );
    }
    res.status(200).json({
      success: true,
      message: 'Logout successful. Refresh token revoked.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by protect middleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};

/**
 * @desc    Generate password reset token and email simulation log
 * @route   POST /auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User with this email does not exist' });
    }

    // Generate raw reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token and set expiry (10 min)
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Email simulator log output
    console.log(`\n======================================================================`);
    console.log(`📬 [EMAIL SIMULATOR] Password reset link for ${user.email}:`);
    console.log(`👉 http://127.0.0.1:5000/auth/reset-password/${resetToken}`);
    console.log('======================================================================\n');

    const responsePayload = {
      success: true,
      message: 'Password reset email sent successfully'
    };

    if (process.env.NODE_ENV !== 'production') {
      responsePayload.resetToken = resetToken;
    }

    res.status(200).json(responsePayload);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Forgot password operation failed', error: error.message });
  }
};

/**
 * @desc    Reset password using reset token
 * @route   POST /auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    // Hash raw token
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Find user with matching token and unexpired time
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token fields
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful! You can now log in with your new password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
  }
};

/**
 * @desc    Change logged-in user password
 * @route   POST /auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    const user = await User.findById(req.user.id);

    // Validate current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Password change failed', error: error.message });
  }
};

/**
 * @desc    Refresh access token and rotate refresh token
 * @route   POST /auth/refresh-token
 * @access  Public
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'supersecretkey123');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check token list for current active token
    const hasToken = user.refreshTokens.includes(refreshToken);

    if (!hasToken) {
      // Token Reuse Detection! Clear user's active sessions as defensive shield.
      user.refreshTokens = [];
      await user.save();
      return res.status(401).json({
        success: false,
        message: 'Token reuse detected! All active sessions revoked.'
      });
    }

    // Rotate: Issue new access token and rotated refresh token
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'supersecretkey123',
      { expiresIn: '15m' }
    );
    const newRefreshToken = jwt.sign(
      { id: user._id, jti: crypto.randomBytes(24).toString('hex') },
      process.env.JWT_SECRET || 'supersecretkey123',
      { expiresIn: '7d' }
    );

    // Remove old token and add new rotated token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message
    });
  }
};

/**
 * @desc    Revoke specific refresh token
 * @route   POST /auth/revoke-token
 * @access  Public
 */
export const revokeToken = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    await User.updateOne(
      { refreshTokens: refreshToken },
      { $pull: { refreshTokens: refreshToken } }
    );

    res.status(200).json({
      success: true,
      message: 'Refresh token revoked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token revocation failed',
      error: error.message
    });
  }
};
