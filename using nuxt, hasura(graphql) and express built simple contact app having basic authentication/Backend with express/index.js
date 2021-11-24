// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// Initialize express and define a port
const app = express()
const PORT = 3003
const secret = 'your-secret'
var co1 = 0
// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

// To allow the user to login with hasura login action
app.post('/login', async (req, res) => {
  const { id, email, password, encpass } = req.body.input;
  const xx = await bcrypt.compare(password, encpass);
  var act;
  const r = {
    "https://hasura.io/jwt/claims": {
    'x-hasura-allowed-roles': ['public', 'admin', 'user'],
    'x-hasura-default-role': 'user',
    'x-hasura-user-id': id,
    'x-hasura-user-email': email
  }}
  if (xx == true){
    act = jwt.sign(
      r, secret, {algorithm: 'HS512'}
    );
  }
  else act = 'Wrong Credentials'
  console.log(++co1 + ' login attempt');
  res.json({
    accessToken: act
  })
})
var co = 0;

// To allow the user to sigup with hasura password encripting action

app.post('/hashing', async (req, res) => {
  const { pwd } = req.body.input;
  
  const salt = await bcrypt.genSalt(10);

  const hpwd = await bcrypt.hash(pwd, salt);

  console.log("Encription Done for "+ ++co +" user.");
  res.json({
    hash: hpwd
  })
})

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))