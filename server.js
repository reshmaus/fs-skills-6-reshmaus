const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())
app.use(cors());

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '082b82701a20485eaf03bd2b5b334b72',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
    rollbar.log("Accessed HTML successfully")
});

app.get('/styles', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.css'))
    rollbar.log("Accessed css successfully")
  })

app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.js'))
    rollbar.log("Accessed js file successfully")
  })

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
        rollbar.info("It's sending all the Bots from DB");
        //res.status(200).send(bots) //<-- Corrected code
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        rollbar.error("Error getting all the Bots");
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots) 
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8) 
        res.status(200).send({choices, compDuo})
        rollbar.log("sending back five random Bots choice card and compcards", {choices,compDuo});
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        rollbar.error("Error getting five Bots cards")
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
            rollbar.info("Player lost the game")
        } else {
             playerRecord.losses++
           //playerRecord.wins++  // Corrected code
           rollbar.info("Player won the game")
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        rollbar.error("Error in dueling")
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
        rollbar.log("Player status", playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        rollbar.error("Error getting player status")
        res.sendStatus(400)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})