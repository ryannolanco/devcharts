const knex = require("../db/connection");

function create(user) {
  return knex("users")
    .insert(user)
    .returning("*")
    .then((results) => results[0]);
}

function getUserByEmail(email) {
  return knex("users").select("*").where("email", email).first();
}

module.exports = {
  create,
  getUserByEmail
};
