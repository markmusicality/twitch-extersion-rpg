// Step 1: server.js (Node + Express backend)

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const playersFile = path.join(__dirname, 'data', 'players.json');

// Load players or create file if missing
let players = {};
if (fs.existsSync(playersFile)) {
  players = JSON.parse(fs.readFileSync(playersFile));
} else {
  fs.writeFileSync(playersFile, '{}');
}

function savePlayers() {
  fs.writeFileSync(playersFile, JSON.stringify(players, null, 2));
}

app.post('/character', (req, res) => {
  const { userId, class: charClass, race, weapon } = req.body;
  if (!userId || !charClass || !race || !weapon) return res.status(400).send('Missing fields');

  players[userId] = {
    class: charClass,
    race,
    weapon,
    level: 1,
    xp: 0,
    gold: 0,
    wins: 0,
    losses: 0,
    dungeonLevel: 1,
    inventory: []
  };

  savePlayers();
  res.json({ message: 'Character created', player: players[userId] });
});

app.post('/raid', (req, res) => {
  const { userId } = req.body;
  const player = players[userId];
  if (!player) return res.status(404).send('Player not found');

  // Simulate a simple raid result
  const loot = Math.floor(Math.random() * 10) + 5;
  const xp = Math.floor(Math.random() * 8) + 3;

  player.gold += loot;
  player.xp += xp;
  player.dungeonLevel++;

  savePlayers();
  res.json({ message: 'Raid complete', loot, xp, newLevel: player.dungeonLevel });
});

app.post('/duel', (req, res) => {
  const { userId, opponentId } = req.body;
  const player = players[userId];
  const opponent = players[opponentId];
  if (!player || !opponent) return res.status(404).send('One or both players not found');

  const playerPower = Math.random() * player.level;
  const opponentPower = Math.random() * opponent.level;
  let winner;

  if (playerPower > opponentPower) {
    player.wins++;
    opponent.losses++;
    winner = userId;
  } else {
    opponent.wins++;
    player.losses++;
    winner = opponentId;
  }

  savePlayers();
  res.json({ message: 'Duel resolved', winner });
});

app.get('/player/:id', (req, res) => {
  const player = players[req.params.id];
  if (!player) return res.status(404).send('Player not found');
  res.json(player);
});

app.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`));
