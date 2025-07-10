let token = '';
let userId = '';

Twitch.ext.onAuthorized(auth => {
  token = auth.token;
  userId = auth.userId;
  console.log('Twitch Authorized', userId);
});

function createCharacter() {
  const charClass = document.getElementById('class').value;
  const race = document.getElementById('race').value;
  const weapon = document.getElementById('weapon').value;

  fetch('https://twitch-rpg-backend.onrender.com/character', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, class: charClass, race, weapon })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('builder').classList.add('hidden');
      document.getElementById('actions').classList.remove('hidden');
      document.getElementById('results').textContent = JSON.stringify(data.player, null, 2);
    })
    .catch(err => alert('Error creating character: ' + err.message));
}

function raid() {
  fetch('https://twitch-rpg-backend.onrender.com/raid', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('results').textContent = `🏰 Raid Complete!\n+${data.xp} XP, +${data.loot} Gold\nNow on level ${data.newLevel}`;
    })
    .catch(err => alert('Raid failed: ' + err.message));
}

function duel() {
  // Use demo opponent for now
  const opponentId = 'demo_user_123';

  fetch('https://twitch-rpg-backend.onrender.com/duel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, opponentId })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('results').textContent = `⚔️ Duel Result: ${data.winner === userId ? 'You Win!' : 'You Lose.'}`;
    })
    .catch(err => alert('Duel failed: ' + err.message));
}
