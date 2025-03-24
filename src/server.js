const express = require('express')
const app = express()
const port = 8017;
const hostname = 'localhost'
app.get('/', function (req, res) {
  res.send(`<h1>Hello Vux</h1>`)
})

app.listen(port, hostname,()=>{
    console.log(`App is running at http://${hostname}:${port}`);
    

})