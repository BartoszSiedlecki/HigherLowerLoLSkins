const moreBttn = document.getElementById("more-btn")
const lessBttn = document.getElementById("less-btn")
const previousBg = document.getElementById("previous")
const previousName = document.getElementById("previous-name")
const previousSkins = document.getElementById("previous-skins")
const previousPortrait = document.getElementById("previous-portrait")
const currentBg = document.getElementById("current")
const currentName = document.getElementById("current-name")
const currentSkins = document.getElementById("current-skins")
const currentPortrait = document.getElementById("current-portrait")
const scoreContainer = document.getElementById("score")
const loseMenu = document.getElementById("lose-menu")
const playAgainBttn = document.getElementById("play-again")
const rankList = document.querySelectorAll("[data-img]")
const briefingText = document.getElementById("briefing-text")
const timeBar = document.getElementById("time-bar")
const scoreMobile = document.getElementById("score-mobile")
const submitNameBtn = document.getElementById("submit-name")
const playerName = document.getElementById("submit-value")
const playerSendForm = document.getElementById("player-send-form")
const sendPopUp = document.getElementById("send-pop-up")
const postLoseScore = document.getElementById("final-score")

const previousImg = document.createElement('img')
const currentImg = document.createElement('img')

let score = 0
let champions = new Array
let usedChampions = new Array
let id = 0
let previousId = 500
let previousSkinCount = 0
let currentSkinCount = 0
let timeLeft = 0
let interval = null

const moveToLeft = [
    { transform: "translateX(0)"},
    { transform: "translateX(-100%)"}
]

const fadeIn = [
    { opacity: 0},
    { opacity: 1}
]

const colour = [
    { filter: "grayscale(100%)"},
    { scale: "120%"},
    { filter: "grayscale(0%)"}
]

const rankMessages = [
    "Happens to the best! Good luck next time.",
    "You put up a good fight! I bet you can do even better.",
    "That's about halfway there. You're getting better!",
    "This is actually way better than average. I bet you have a massive skin collection.",
    "Most people would be satisfied by now, and you're somehow still going... I wonder what they are feeding you with.",
    "Everyone's dream... But you've made it a reality."
  ]
  
const rankTresholds = [0, 30, 60, 90, 120, 150]

fetch("championFull.json")
    .then((res) => res.json())
    .then((data) => {
        for(let i in data.data){
            champions.push(data.data[i])
        }
        generateStartingSetup(champions, data)
        
        moreBttn.addEventListener("click", e => {
            moreBttn.disabled = true
            lessBttn.disabled = true
            clearInterval(interval)
            revealAnswer(() =>{
                if(currentSkinCount >= previousSkinCount){
                    if(champions.length === 0){
                        winGame()
                    }
                    nextChampion(champions, data)
                } else lostGame(champions, data)
            }) 
        })

        lessBttn.addEventListener("click", e => {
            moreBttn.disabled = true
            lessBttn.disabled = true
            clearInterval(interval)
            revealAnswer(() =>{
                if(currentSkinCount <= previousSkinCount){
                    if(champions.length === 0){
                        winGame()
                    }
                    nextChampion(champions, data)
                } else lostGame(champions, data)
            }) 
        })
    })

function generateStartingSetup(champions, data){
    champions = []
    for(let i in data.data){
        champions.push(data.data[i])
    }
    score = 0
    scoreContainer.innerText = 0
    scoreMobile.innerText = 0
    loseMenu.style.opacity = 0
    loseMenu.style.pointerEvents = "none"
    generateChampion(champions)
    previousSkinCount = champions[id].skins.length -1
    appendPreviousChamp(champions)
    generateChampion(champions)
    currentSkinCount = champions[id].skins.length -1
    appendCurrentChamp(champions)
    timeBar.style.backgroundColor = "rgb(0, 128, 0)"
    timeBar.children[0].innerText = "10"
    timeBar.style.width = "100%"
    moreBttn.disabled = false
    lessBttn.disabled = false
    resetFormBttns()
}

function generateChampion(champions){
    id = Math.floor(Math.random() * champions.length)
        if(id === previousId){
            if(id === 0) id++
            else id--
        }
    previousId = id
}

function appendPreviousChamp(champions){
    previousBg.style.backgroundImage = "url(img/splash/" + champions[id].id + "_0.jpg)"
    previousName.innerText = champions[id].name
    previousSkins.innerText = champions[id].skins.length -1
    previousSkinCount = champions[id].skins.length -1
    previousImg.src = "img/loading/" + champions[id].id + "_0.jpg"
    previousPortrait.appendChild(previousImg)
}

function appendCurrentChamp(champions){
    currentBg.style.backgroundImage = "url(img/splash/" + champions[id].id + "_0.jpg)"
    currentName.innerText = champions[id].name
    currentSkinCount = champions[id].skins.length -1
    currentSkins.innerText = "?"
    currentImg.src = "img/loading/" + champions[id].id + "_0.jpg"
    currentPortrait.appendChild(currentImg)
}

function nextChampion(champions, data){
    addPoints()
    currentBg.animate(moveToLeft, 500)
    setTimeout(() =>{
        appendPreviousChamp(champions)
        champions.splice(id, 1)
        generateChampion(champions)
        appendCurrentChamp(champions)
        currentBg.animate(fadeIn, 500)
    }, 490)
    resetTimeBar(champions, data)
    moreBttn.disabled = false
    lessBttn.disabled = false
}

function addPoints(){
    score++
    scoreContainer.innerText = score    
    scoreContainer.animate(fadeIn, 500)
    scoreMobile.innerText = score
    scoreMobile.animate(fadeIn, 500)
}

function revealAnswer(callback){
    let i = 1
    const interval = setInterval(() =>{
        currentSkins.innerText = i
        i++
        if (i > currentSkinCount) {
            clearInterval(interval)
            callback()
        }
    }, 100)
}


function lostGame(champions, data){
    setTimeout(() => {
        loseMenu.style.opacity = 1
        loseMenu.style.pointerEvents = "all"
        loseMenu.animate(fadeIn, 500)

        for(let i=0; i<rankMessages.length; i++){
            const rank = rankList[i]
            if(score >= rankTresholds[i]){
                rank.style.filter = "grayscale(0)"
                rank.animate(colour, 700 + i * 200)
                briefingText.innerText = rankMessages[i]
            }
        }

        for(let i=0; i<=score; i++){
            setTimeout(() => {postLoseScore.innerHTML = i}, 50 * i)
        }
        

        playerSendForm.addEventListener("submit", e =>{
            event.preventDefault()
            let playerNickname = playerName.value
            sendPlayerScore(globalDataLength ,playerNickname, score, 1)
            afterSendPopUp()
        })

        playAgainBttn.addEventListener("click", e =>{
            generateStartingSetup(champions, data)
        })

    }, 500)
}

function resetTimeBar(champions, data){
    timeLeft = 10
    let half = timeLeft/2
    let rgb = 0
    timeBar.style.backgroundColor = "rgb(0, 128, 0)"
    timeBar.style.transition = "width 1s linear, background-color 1s linear"
    timeBar.style.width = "100%"
    timeBar.children[0].innerText = timeLeft
    clearInterval(interval)
    interval = setInterval(() =>{
        timeLeft--
        timeBar.style.width = timeLeft*10 + "%"
        timeBar.children[0].innerText = timeLeft
        if(timeLeft >= half){
            rgb = rgb + 25
            timeBar.style.backgroundColor = "rgb("+ rgb + ", 128, 0)"
        }
        else{
            rgb = rgb - 25
            timeBar.style.backgroundColor = "rgb(128," + rgb + ",0)"
        }
        if (timeLeft === -1) {
            timeBar.children[0].innerText = 0
            clearInterval(interval)
            lostGame(champions, data)
          }
    }, 1000)
}

function afterSendPopUp(){
    sendPopUp.style.opacity = 1
    submitNameBtn.disabled = true
    playerName.disabled = true
}

function resetFormBttns(){
    sendPopUp.style.opacity = 0
    submitNameBtn.disabled = false
    playerName.disabled = false
    playerName.value = ""
}

const scoreboard = document.getElementById("scoreboard")
const scoreboardBtn = document.getElementById("scoreboard-btn")
const scoreboardCont = document.getElementById("scoreboard-container")
let globalDataLength = 0

fetchScoreboardData()
function fetchScoreboardData(){
    fetch('https://lolgame-backend.onrender.com/scores')   //http://localhost:10000/scores
    .then(response => response.json())
    .then(data => {
        globalDataLength = data.length
        scoreboardBtn.addEventListener("click", e =>{
            fetchScoreboardData()
            scoreboardCont.style.display = "grid"
            generateScoreboard(data) 
        })
    })
    .catch(error => console.error(error));
}

function generateScoreboard(data){
    scoreboard.innerText = ""
    for(let i=0; i<data.length; i++){
        const playerData = document.createElement("ul")
        const playerRanking = document.createElement("li")
        const playerName = document.createElement("li")
        const playerScore = document.createElement("li")
        const playerAttempt = document.createElement("li") 
        playerData.appendChild(playerRanking)
        playerData.appendChild(playerName)
        playerData.appendChild(playerScore)
        playerData.appendChild(playerAttempt)
        scoreboard.appendChild(playerData)
        playerData.classList.add("row")
        playerRanking.classList.add("ranking")
        playerName.classList.add("player-name")
        playerScore.classList.add("score")
        playerAttempt.classList.add("attempts")
        playerRanking.innerText = i + 1
        playerName.innerText = data[i].player_name
        playerScore.innerText = data[i].score
        playerAttempt.innerText = data[i].attempts
    }
}

scoreboardCont.addEventListener("click", e =>{
    scoreboardCont.style.display = "none"
})

function sendPlayerScore(id, playerName, score, attempts){
    fetch('https://lolgame-backend.onrender.com/submit', { //http://localhost:10000/submit
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id, playerName: playerName, score: score, attempts: attempts })
    })
    .then(response => response.json())
    .catch(error => console.error(error))
}
