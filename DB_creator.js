
var pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1377@localhost:5432/users'
const client = new pg.Client(connectionString)
client.connect();

//delete query DROP TABLE table_name
client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, username text not null, password text not null, followers integer[] , following integer[] , following_requests integer[] , bio text )', (err, res) => {
  console.log(err, res)
  client.end()
})