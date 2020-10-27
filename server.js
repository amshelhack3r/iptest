const http = require('http');

//bring in axios to make fetch calls to the ipwhois api
const axios = require('axios').default;

//bring in ipware to get ip address of the incoming request
const getIP = require('ipware')().get_ip;

//set up winston to log our errors
//setup our logger. this is for dev purposes
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;


const logger = createLogger({
    format: combine(
        label({ label: 'IP TEST LOGGER LOGGER' }),
        timestamp(),
        prettyPrint()
    ),
    transports: [new transports.File({ filename: 'error.log', level: 'error' }),]
})
//create a node server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    //get the ip address from the request
    //this will return an object of ClientIp<String> and ClientRoutableTable<Boolean> 
    const ip = getIP(req)

    //query the ipwhois api. 
    axios.get(`http://ipwhois.app/json/${ip.clientIp}`)
        .then(response => {
            res.write(response.data)
            res.end()
        })
        .catch(err => {
            logger.error(err)
            res.end()
        })


})
//start the server
server.listen(5000)