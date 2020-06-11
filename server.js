require('dotenv').config()

const https = require('https')
const httpProxy = require('http-proxy')
const devcert = require('devcert')

const ssl = async function() {
  try {
    return await devcert.certificateFor(process.env.APPLICATION_HOST)
  } catch (err) {
    console.log(err)
  }
}

const proxy = httpProxy.createProxyServer({})

setTimeout(async function() {
  let cert = await ssl()
  const server = https.createServer(cert, function(req, res) {
    proxy.web(req, res, { target: process.env.APPLICATION_HOST })
  })

  const run = server.listen(process.env.APPLICATION_PORT, process.env.APPLICATION_HOST)
  console.log(`Application running in: ${process.env.APPLICATION_HOST.replace("http", "https")}:${process.env.APPLICATION_PORT}`)
}, 500)
