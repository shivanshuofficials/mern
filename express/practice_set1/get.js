const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
//create home page
app.get('/', (req, res) => {
    res.send('Welcome to Express Learning')
})

//create user page
app.get('/users', (req, res) => {
   res.send(`User page`);
})

//create new user id page
app.get('/users/:id', (req, res) => {
   res.send(`User ID is ${req.params.id}`);
})

//register via post
app.post("/register", (req, res) => {
  console.log(req.body);
  console.log("Data received successfully");
  res.send("Data received successfully");
});

//update via put
app.put("/users/:id", (req, res) => {
  res.send(`User ${req.params.id} fully updated`);
});

//update via patch
app.patch("/users/:id", (req, res) => {
  res.send(`User ${req.params.id} partially updated`);
});


//delete via delete
app.delete("/users/:id", (req, res) => {
  res.send(`User ${req.params.id} deleted`);
  console.log(`User ${req.params.id} deleted`);
});


//server online
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
