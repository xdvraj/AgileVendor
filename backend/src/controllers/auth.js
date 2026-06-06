const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const env = require("../config/env");
const { logActivity } = require("../utils/logger");

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signup = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("A user with this email already exists.", 409);
  }

  const user = await User.create({ name, email, password, role });
  const token = signToken({ userId: user._id, role: user.role });

  res.cookie("token", token, cookieOptions);

  await logActivity({
    action: "User created",
    entity: "User",
    entityId: user._id,
    description: `${user.name} (${user.email}) signed up as ${user.role}`,
    performedBy: user._id,
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signToken({ userId: user._id, role: user.role });

  res.cookie("token", token, cookieOptions);

  res.json({
    success: true,
    message: "Logged in successfully.",
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  res.json({
    success: true,
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
});

const logout = catchAsync(async (_req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0), sameSite: "lax" });
  res.json({ success: true, message: "Logged out successfully." });
});

module.exports = { signup, login, getMe, logout };
