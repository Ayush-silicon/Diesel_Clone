const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Load data from db.json
let db = require('./db.json');
const dbPath = path.join(__dirname, 'db.json');

function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

app.post('/login', (req, res) => {
  const { mobileNumber, otp } = req.body;

  const user = db.users.find((user) => user.mobileNumber === mobileNumber);

  if (user && user.otp === otp) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid mobile number or OTP' });
  }
});

app.post('/send-otp', (req, res) => {
  const { mobileNumber } = req.body;

  const userIndex = db.users.findIndex((user) => user.mobileNumber === mobileNumber);

  if (userIndex !== -1) {
    const user = db.users[userIndex];
    // Generate a random OTP and update the user's OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    db.users[userIndex] = user;

    // Replace with secure OTP sending
    console.log(`OTP ${otp} sent to ${mobileNumber}`);

    saveDb();
    res.json({ message: `OTP sent to ${mobileNumber}` });
  } else {
    // Create a new user and generate an OTP
    const newUser = { mobileNumber, otp: Math.floor(100000 + Math.random() * 900000) };
    db.users.push(newUser);

    // Replace with secure OTP sending
    console.log(`OTP ${newUser.otp} sent to ${newUser.mobileNumber}`);

    saveDb();
    res.json({ message: `OTP sent to ${mobileNumber}` });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
