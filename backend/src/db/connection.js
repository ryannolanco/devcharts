const env = process.env.NODE_ENV || 'development';
const config = require('../../knexfile.cjs')[env];
const knex = require('knex')(config);

module.exports = knex;
