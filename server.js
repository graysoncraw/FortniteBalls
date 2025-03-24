const express = require ("express")

const server = express()

server.all("/", (req, res) => {
  res.send(`Bot is running!\nCurrent time: ${new Date()}`);
})

function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is up")
  })
}

module.exports = keepAlive;