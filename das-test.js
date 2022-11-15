// RUN: node das-test.js ./_data/simple-query.JSON


const fs = require('fs');
const fetch = require('node-fetch');
const { exit } = require('process');

if (!(file = process.argv.slice(2)[0])) {
    console.log('Missing input file: usage das-test <input>')
    exit(1)
}

const jwt = process.env['JWT']
if (!jwt) {
    console.log('Missing JWT. Use export JWT=<jwt-value> to set your jwt')
    exit(1)
}

const readJson = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath))
}

const postRequest = async (url, jwt, body) => {
    const options = {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        }
    }

    try {
        const response = await fetch(url, options)
        console.log(`Status: ${response.status} - ${response.statusText}`)

        if (response.status == 200) {
            const data = await response.json()
            console.log('Result: ', data)
        }
    }
    catch (error) {
        console.log('Error: ', error)
    }
}

// const host = 'http://localhost:5130'
const host = 'https://data-access-service.ci-develop.crunch.prism.enverus.dev'
const url = `${host}/json/records`
const body = readJson(file)

postRequest(url, jwt, body)
