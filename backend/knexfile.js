require('dotenv').config();
const path = require('path'); // Add this to require 'path'

const { DATABASE_URL, DATABASE_URL_EXTERNAL } = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: DATABASE_URL_EXTERNAL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
  },
};

	// production: {
	// 	client: 'postgresql',
	// 	connection: {
	// 		database: 'my_db',
	// 		user: 'username',
	// 		password: 'password',
	// 	},
	// 	pool: {
	// 		min: 2,
	// 		max: 10,
	// 	},
	// 	migrations: {
	// 		tableName: 'knex_migrations',
	// 	},
	// },
};
