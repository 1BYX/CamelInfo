const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'keypair', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const extractOwnerId = (token) => {
    const tokenParts = token.split(' ');
    const payload = jwt.decode(tokenParts[1], PUB_KEY)
    return payload.sub
}

module.exports = extractOwnerId