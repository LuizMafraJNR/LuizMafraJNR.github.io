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
let matches = 0;
let gameStarted = false;
let canShowTable = false;
let canPlay = false;

function addPlayer(name) {
    const score = gameStarted ? 3 : 5;
    const player = { name: name, score: score, wins: 0 };
    players.push(player);
    updateTable();
    clearInput();
}

function showRankTableAndUpdate() {
    if(matches > 0) {
        const rankTable = document.getElementById('rankTable');
        if (rankTable.style.display === 'none') {
            rankTable.style.display = 'table';
        } 
        updateRankTable();
    }
}

function showTable() {
    canShowTable = !canShowTable;
    const table = document.getElementById('playerTable');
    table.style.display = canShowTable ? 'block' : 'none';
}

function clearInput() {
    document.getElementById('playerName').value = '';
}

function startGame() {
    gameStarted = true;
    document.getElementById('startGameButton').disabled = true;
    document.getElementById('stopGameButton').style.display = 'block';
}

function stopGame() {
    gameStarted = false;
    matches += 1;
    setWinner();
    document.getElementById('startGameButton').disabled = false;
    document.getElementById('stopGameButton').style.display = 'none';
    resetPoints();
    showRankTableAndUpdate();
}

function resetPoints() {
    players.forEach(player => player.score = 5);
    updateTable();
}

function firstToUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function updateTable() {
    const tbody = document.getElementById('playerTableBody');
    tbody.innerHTML = '';
    players.forEach((player, index) => {
        const row = document.createElement('tr');
        const formattedName = firstToUpper(player.name);
        row.innerHTML = `
            <td>${formattedName}</td>
            <td>${player.score}</td>
            <td>
                <div class="d-flex justify-content-around flex-wrap">
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

function updateRankTable() {
    const button = document.getElementById('rankingText');
    if (button.style.display === 'none') {
        button.style.display = 'block';
    }
    const rankTableBody = document.getElementById('rankTableBody');
    rankTableBody.innerHTML = '';
    players.sort((a, b) => b.wins - a.wins).forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.wins}</td>
        `;
        rankTableBody.appendChild(row);
    });
}

function validateIfGameIsStarted() {
    if (gameStarted === false) {
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
            const formattedName = firstToUpper(players[index].name);
            alert(formattedName + ' foi eliminado');
            removePlayer(index);
        }
    }
    updateTable();
}

function removePlayer(index) {
    validateIfGameIsStarted();
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
        winners[0].wins += 1;
        alert(`O vencedor é ${winners[0].name} com ${winners[0].score} pontos`);
    }
}