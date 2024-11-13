document.getElementById('button-addon2').addEventListener('click', function() {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        addPlayer(playerName);
        document.getElementById('playerName').value = '';
    }
});

document.getElementById('button-addon2').addEventListener('click', function(event) {
    if (event.key === 'Enter')
    addPlayer()
})

document.getElementById('playerName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        let playerName = document.getElementById('playerName').value;
        if (playerName) {
            addPlayer(playerName);
        }
        else {
            alert('Digite o nome do jogador');
        }
    }
})

document.getElementById('startGameButton').addEventListener('click', function() {
    startGame();
});

document.getElementById('stopGameButton').addEventListener('click', function() {
    stopGame();
});

let players = [];
let gameStarted = false;
let timer;
let seconds = 0;
let canShowTable = false;
let canPlay = false;

function addPlayer(name) {
    const score = gameStarted ? 3 : 5;
    const player = { name: name, score: score };
    players.push(player);
    if(players.length === 3 && !canPlay) {
        canPlay = true;
        showTable();
    }
    updateTable();
    clearInput();
}

function showTable() {
    canShowTable = !canShowTable;
    const table = document.getElementById('playerTable');
    table.style.display = canShowTable ? 'block' : 'none';
}

function clearInput()
{
    document.getElementById('playerName').value = '';
}

function startGame() {
    gameStarted = true;
    document.getElementById('startGameButton').disabled = true;
    document.getElementById('stopGameButton').style.display = 'block';
    startCounter();
}

function stopGame() {
    gameStarted = false;
    setWinner();
    document.getElementById('startGameButton').disabled = false;
    document.getElementById('stopGameButton').style.display = 'none';
    stopCounter();
    resetPoints();
}

function resetPoints() {
    players.forEach(player => player.score = 5);
    updateTable();
}

function startCounter() {
    timer = setInterval(() => {
        seconds++;
        document.getElementById('counter').innerText = `Tempo: ${seconds} segundos`;
    }, 1000);

}

function stopCounter() {
    clearInterval(timer);
    seconds = 0;
    document.getElementById('counter').innerText = '';
}

function updateTable() {
    const tbody = document.getElementById('playerTableBody');
    tbody.innerHTML = '';
    players.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.score}</td>
            <td>
                <div class="d-flex justify-content-around">
                    <button class="btn-icon increase" onclick="increaseScore(${index})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn-icon decrease" onclick="decreaseScore(${index})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="btn-icon remove" onclick="removePlayer(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function validateIfGameIsStarted() {
    if(gameStarted === false){
        alert('O jogo não foi iniciado');
        throw new Error('O jogo não foi iniciado');
    }
}

function increaseScore(index) {
    validateIfGameIsStarted();
    players[index].score += 1;
    updateTable();
}

function decreaseScore(index) {
    validateIfGameIsStarted();
    if (players[index].score > 0) {
        players[index].score -= 1;
        if (players[index].score === 0) {
            alert(players[index].name + ' foi eliminado');
            removePlayer(index);
        }
    }
    updateTable();
}

function removePlayer(index) {
    players.splice(index, 1);
    updateTable();
}

function setWinner() {
    let maxScore = Math.max(...players.map(player => player.score));
    let winners = players.filter(player => player.score === maxScore);

    if (winners.length > 1) {
        let winnerNames = winners.map(player => player.name).join(', ');
        alert(`Empate entre ${winnerNames} com ${maxScore} pontos`);
    } else {
        alert(`O vencedor é ${winners[0].name} com ${winners[0].score} pontos`);
    }
}