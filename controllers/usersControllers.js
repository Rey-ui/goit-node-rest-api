import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import gravatar from "gravatar";
import path from "node:path";
import {
  loginSchema,
  registerSchema,
  resendVerification,
} from "../schemas/joiSchemas.js";
import Jimp from "jimp";
import * as fs from "node:fs/promises";
import mail from "../mail.js";

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const { error } = registerSchema.validate(
      { email, password },
      {
        abortEarly: false,
      }
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    mail.sendMail({
      to: email,
      from: "a.qwerty0444@gmail.com",
      subject: "Welcome",
      html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    const reguser = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });
    console.log(req.body.verify);
    console.log(reguser);
    res.status(201).send({ message: "Registration successfully!" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate(
      { email, password },
      {
        abortEarly: false,
      }
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const user = await User.findOne({ email });

    if (user === null) {
      console.log("Email");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }
    if (user.verified === false) {
      return res.status(401).send({ message: "Please verify your email" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await User.findByIdAndUpdate(user._id, { token }, { new: true });
    res.status(200).json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const userToken = await User.findByIdAndUpdate(
      req.user.id,
      { token: null },
      { new: true }
    );
    if (!userToken) {
      return res.status(401).send({ message: "Not authorized" });
    }
    return res.status(204).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
}
async function currentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
}
async function changeAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File not provided" });
    }
    const newPath = path.resolve("public", "avatars", req.file.filename);
    const tmpPath = req.file.path;
    const avatarURL = path.join("/avatars", req.file.filename);

    const { error } = changeAvatarSchema.validate(
      { avatarURL },
      {
        abortEarly: false,
      }
    );
    if (error) {
      await fs.unlink(tmpPath);
      return res.status(400).json({ message: error.message });
    }
    const image = await Jimp.read(tmpPath);

    await image.resize(250, 250).writeAsync(newPath);
    await fs.unlink(tmpPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );
    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }

    res.status(200).json({
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
}
async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken: verificationToken });

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({ message: "Email confirm successfully!" });
  } catch (error) {
    next(error);
  }
}

async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;
    const { error } = resendVerification.validate(
      { email },
      {
        abortEarly: false,
      }
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const verificationToken = crypto.randomUUID();

    mail.sendMail({
      to: email,
      from: "a.qwerty0444@gmail.com",
      subject: "Welcome",
      html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}
export default {
  register,
  login,
  logout,
  currentUser,
  changeAvatar,
  verifyEmail,
  resendVerificationEmail,
};
