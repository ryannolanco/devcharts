const service = require("./users.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

require("dotenv").config(); // Ensure this is called once in your app (can also go in your server.js)

//in future create table for admin emails and only admin can post to this table.
const adminEmails = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim())
  : [];

const requiredProperties = [
  "first_name",
  "last_name",
  "email",
  "password",
  `confirm_password`,
];

/* ----- HELPER FUNCTIONS ----- */

//check if properties are present
function bodyDataHasFields(requiredProperties) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    for (const property of requiredProperties) {
      if (!data[property]) {
        next({ status: 400, message: `Must include ${property}` });
      }
    }
    next();
  };
}
//check if email is valid
function emailIsValid(req, res, next) {
  const { data: { email } = {} } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim();

  if (!emailRegex.test(trimmedEmail)) {
    return next({ status: 400, message: `${email} must be a valid email.` });
  }

  if (typeof email !== "string") {
    return next({
      status: 400,
      message: "Email is required and must be a string.",
    });
  }

  next();
}

//check if email is already in use
async function emailDoesNotExist(req, res, next) {
  const { data: { email } = {} } = req.body;

  if (typeof email !== "string") {
    return next({
      status: 400,
      message: "Email is required and must be a string.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const userWithEmail = await service.readUser(normalizedEmail);
    if (userWithEmail) {
      return next({
        status: 400,
        message: `User with email ${normalizedEmail} already exists.`,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
}

//check if password is valid
function passwordIsValid(req, res, next) {
  const { data: { password, confirm_password } = {} } = req.body;
  if (typeof password !== "string") {
    return next({
      status: 400,
      message: "Password is required and must be a string.",
    });
  }
  //password has correct characters

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[^\s]+$/;

  if (!passwordRegex.test(password)) {
    return next({
      status: 400,
      message:
        "Password must include at least one uppercase letter, one number, and one special character. Must not include spaces.",
    });
  }

  if (password.length < 8) {
    return next({
      status: 400,
      message: "Password must be at least 8 characters long.",
    });
  }

  //check if password matches
  if (password !== confirm_password) {
    return next({
      status: 400,
      message: "Passwords must match.",
    });
  }

  next();
}

//check if name is valid
function nameIsValid(req, res, next) {
  const { data: { first_name, last_name } = {} } = req.body;

  if (!first_name || !last_name) {
    return next({
      status: 400,
      message: "Both first name and last name are required.",
    });
  }

  const trimmedFirstName = first_name.trim();
  const trimmedLastName = last_name.trim();

  // Check if first and last names are between 1 and 20 characters
  if (trimmedFirstName.length < 1 || trimmedFirstName.length > 20) {
    return next({
      status: 400,
      message: "First name must be between 1 and 20 characters.",
    });
  }

  if (trimmedLastName.length < 1 || trimmedLastName.length > 20) {
    return next({
      status: 400,
      message: "Last name must be between 1 and 20 characters.",
    });
  }

  // Ensure the names only contain alphabetic characters and spaces
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(trimmedFirstName)) {
    return next({
      status: 400,
      message: "First name can only contain letters and spaces.",
    });
  }

  if (!nameRegex.test(trimmedLastName)) {
    return next({
      status: 400,
      message: "Last name can only contain letters and spaces.",
    });
  }

  // Check if names contain multiple consecutive spaces
  const spaceRegex = /\s{2,}/;
  if (spaceRegex.test(trimmedFirstName) || spaceRegex.test(trimmedLastName)) {
    return next({
      status: 400,
      message: "Names cannot contain multiple consecutive spaces.",
    });
  }

  // Capitalize first letters of names (optional)
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const normalizedFirstName = capitalize(trimmedFirstName);
  const normalizedLastName = capitalize(trimmedLastName);

  // Store normalized names
  req.body.data.first_name = normalizedFirstName;
  req.body.data.last_name = normalizedLastName;

  next();
}

//check if is_admin is valid, should only be my email
function adminIsValid(adminEmails) {
  return function (req, res, next) {
    const { data: { isAdmin, email } = {} } = req.body;

    // Ensure email is provided and is a valid string
    if (typeof email !== "string") {
      return next({
        status: 400,
        message: "Email is required and must be a valid string.",
      });
    }

    // Ensure email follows a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next({
        status: 400,
        message: "Email must be a valid format.",
      });
    }

    // Ensure isAdmin is a boolean
    if (typeof isAdmin !== "boolean") {
      return next({
        status: 400,
        message: "isAdmin must be a boolean value.",
      });
    }

    // If the user is an admin, check if the email is in the valid admin list
    if (isAdmin === true) {
      if (!adminEmails.includes(email)) {
        return next({
          status: 400,
          message: "Not a valid admin email.",
        });
      }
    }

    // If the user is not an admin, or email is valid, proceed
    next();
  };
}

/* ---- CRUD FUNCTIONS ---- */
async function createUser(req, res) {
  const data = await service.create(req.body.data);
  res.status(200).json({ data });
}

module.exports = {
  create: [
    bodyDataHasFields(requiredProperties),
    asyncErrorBoundary(emailDoesNotExist),
    emailIsValid,
    nameIsValid,
    adminIsValid(adminEmails),
    passwordIsValid,
    asyncErrorBoundary(createUser),
  ],
};
