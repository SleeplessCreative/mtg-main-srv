const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const error = require("../error");
const db = require("../../models");

/**
 *
 * @param {*} req get request data from client
 * @param {*} res send response to client
 * @param {*} next send error if something went wrong
 */

exports.login = async (req, res, next) => {
  // Parse request data
  const email = req.body.email;
  const password = req.body.password;

  // console.log("ini email", email);
  // console.log("ini password", password);

  try {
    const filter = {
      where: {
        email: email,
      },
      raw: true,
    };

    const findUserData = await db["users"].findAll(filter).then((data) => {
      return data;
    });

    console.log(findUserData);

    if (findUserData.length === 0) {
      // console.log("masuk");
      error.errorFunc(401, "Wrong email/password");
    }
    const user = findUserData[0];

    const hashedPassword = user.password_hash;
    const authorized = await bcrypt.compare(password, hashedPassword);

    if (await authorized) {
      tokenData = {
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        roleId: user.role_id,
        phone: user.phone,
        profilePic: user.profile_picture,
      };

      console.log(tokenData);
      const token = jwt.sign(tokenData, "mantagi-mtg-secret-token", {
        expiresIn: "12h",
      });
      return res.status(202).json({
        message: "Ok",
        token: "bearer " + token,
      });
    } else {
      error.errorFunc(401, "Wrong email/password!");
    }
  } catch (error) {
    next(error);
  }
};
