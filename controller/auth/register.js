const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const error = require("../../middlewares/error");

const db = require("../../models");
const user = require("../../models/user");

/**
 *
 * @param {*} req get request data from client
 * @param {*} res send response to client
 * @param {*} next send error if something went wrong
 */

exports.register = async (req, res, next) => {
  // Parse request data
  // const userId = req.body.userId;
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  let roleId = req.body.roleId;
  let phone = null;
  let address = null;

  // const name = req.body.name;
  // const profilePicture = userId + ".jpg";
  if (req.body.address) {
    address = req.body.address;
  }
  if (req.body.phone) {
    phone = req.body.phone;
  }

  // Database insert query
  try {
    const hashedPass = await bcrypt.hash(password, 10);

    const regUser = {};
    regUser.email = email;
    regUser.first_name = firstName;
    regUser.last_name = lastName;
    regUser.password_hash = hashedPass;
    regUser.role_id = roleId;
    if (address) {
      regUser.address = address;
    }
    if (phone) {
      regUser.phone = phone;
    }

    const filter = {
      attributes: ["email"],
      where: {
        email: email,
      },
      raw: true,
    };

    let isExist = false;
    findUser = await db["users"].findAll(filter).then((data) => {
      return data;
    });

    console.log("find user", findUser[0]);
    if (findUser[0] != undefined) {
      isExist = true;
    }

    await console.log(isExist);

    let objModel;
    if (!isExist) {
      objModel = await db["users"].build(regUser);
      await objModel
        .save()
        .then((data) => {
          // console.log("Registered user data", data);
          // responseData = data;
          return data;
        })
        .catch((err) => {
          console.log("cek error", err);
          // console.log(err.name);
          // console.log(err.message);
          // console.log(err.errors[0].message);
          // error.errorFunc(403, err.errors[0].message);
        });
    } else {
      error.errorFunc(403, "Email already exists");
    }

    // console.log("objModel = ", objModel.dataValues.user_id);

    const inserted = (await objModel) ? true : false;

    if (inserted) {
      const user = objModel.dataValues;
      tokenData = {
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        roleId: user.role_id,
        phone: user.phone,
        profilePic: user.profile_picture,
      };

      const token = jwt.sign(tokenData, "mantagi-mtg-secret-token", {
        expiresIn: "12h",
      });

      response = {
        message: "Ok",
        token: "bearer " + token,
      };
      return res.status(201).json(response);
    } else {
      error.errorFunc(406, "Data not inserted!");
    }
  } catch (error) {
    next(error);
  }
};
