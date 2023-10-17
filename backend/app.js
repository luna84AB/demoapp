// Import the express module 
const express = require('express');
// Import the mysql module  
const mysql = require('mysql2');
// Create the express app 
const app = express();
// Define the connection parameters for the database 
const dbConfig = {
  connectionLimit: 10,
  password: "demoapp",
  user: "demoapp",
  host: "127.0.0.1",
  database: "demoapp",
}
// Create the connection to the database 
const connection = mysql.createConnection(dbConfig);
// Connect to the database 
connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
// Use the express.json() middleware to parse the request body 
app.use(express.json());
// Create a simple get request handler to send a response back  
app.get('/', (req, res) => {
  res.send('Testing!');
});
// Allow CORS to all 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// Post request handler to add a new employee to the database
app.post('/add-employee', (req, res) => {
   console.log(req.body);
  // Write the sql query to add to the database table named employee_test
  const sql = `INSERT INTO employee_test (first_name, last_name, email, password) VALUES ('${req.body.first_name}', '${req.body.last_name}', '${req.body.email}', '${req.body.password}')`;
  // Execute the query 
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
  // Send a response back to the client 
  const response = {
    status: 'success',
    message: 'Employee added succesfully',
  };
  res.status(200).json(response);
});
// Post request handler to login an employee which comes to this route /login 
app.post('/login', (req, res) => {
  console.log(req.body);
  // Write the sql query to retrieve the employee with the email and password provided by the user and compare it with the data in the database 
  const sql = `SELECT * FROM employee_test WHERE email = '${req.body.email}' AND password = '${req.body.password}'`;
  // Execute the query
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    // Check if the result is empty or not 
    if (result.length > 0) {
      // Send a response back to the client 
      const response = {
        status: 'success',
        message: 'Login successful',
      };
      res.status(200).json(response);
    } else {
      // Send a response back to the client 
      const response = {
        status: 'failure',
        message: 'Login failed',
      };
      res.status(403).json(response);
    }
  });
});




// Set up the port to listen to 
const port = 4000;
// Set up the listener 
app.listen(port, () => console.log(`Listening on port ${port}`));






// const express = require('express');
// const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await support

// const app = express();

// const dbConfig = {
//   connectionLimit: 10,
//   password: "demoapp",
//   user: "demoapp",
//   host: "127.0.0.1",
//   database: "demoapp",
// }

// const pool = mysql.createPool(dbConfig); // Use a connection pool

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Testing!');
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

// app.post('/add-employee', async (req, res) => {
//   try {
//     const { first_name, last_name, email, password } = req.body;
//     const sql = "INSERT INTO employee_test (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
//     await pool.query(sql, [first_name, last_name, email, password]);
//     const response = {
//       status: 'success',
//       message: 'Employee added successfully',
//     };
//     res.status(200).json(response);
//   } catch (error) {
//     console.error("Error adding employee:", error);
//     res.status(500).json({ status: 'error', message: 'Failed to add employee' });
//   }
// });

// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const sql = "SELECT * FROM employee_test WHERE email = ? AND password = ?";
//     const [result] = await pool.query(sql, [email, password]);
//     if (result.length > 0) {
//       const response = {
//         status: 'success',
//         message: 'Login successful',
//       };
//       res.status(200).json(response);
//     } else {
//       const response = {
//         status: 'failure',
//         message: 'Login failed',
//       };
//       res.status(403).json(response);
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ status: 'error', message: 'Login failed' });
//   }
// });

// const port = 4000;

// app.listen(port, () => console.log(`Listening on port ${port}`));
