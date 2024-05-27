import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { loginSchema, registerSchema } from "../schemas/joiSchemas.js";
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

    const reguser = await User.create({ email, password: passwordHash });
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

export default { register, login, logout, currentUser };
