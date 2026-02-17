let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let newbtn = document.querySelector(".new");
let winCont = document.querySelector(".winner");
let pl = document.querySelector("#player");
let comp = document.querySelector(".computer");;
let friend = document.querySelector(".friend");
let start = document.querySelector(".start");
let conatiner = document.querySelector(".conatiner");
let exitbtn = document.querySelector(".exit");

let cnt = 0;
let mode = "";
let turnO = true;
let winner = false;

let oScore = 0;
let xScore = 0;
let drawScore = 0;

conatiner.classList.add("hide");
resetbtn.classList.add("hide");
exitbtn.classList.add("hide");

const exitGame = () => {
    if(!confirm("Are you sure you want to exit?")) return;
    turnO = true;
    winner = false;
    cnt = 0;
    mode = "";

    oScore = 0;
    xScore = 0;
    drawScore = 0;

    document.getElementById("oScore").innerText = 0;
    document.getElementById("xScore").innerText = 0;
    document.getElementById("drawScore").innerText = 0;

    document.getElementById("output").innerText = "";
    pl.innerText = "";

    conatiner.classList.add("hide");
    resetbtn.classList.add("hide");
    exitbtn.classList.add("hide");
    start.classList.remove("hide");
    winCont.classList.add("hide");

    enableAllBtns();
};

exitbtn.addEventListener("click", () => {exitGame()});

friend.addEventListener("click", () =>{
    mode = "friend";
    document.getElementById("x").innerHTML =
        `X Wins: <span id="xScore">${xScore}</span>`;
    start.classList.add("hide");
    resetGame();
});

comp.addEventListener("click", () =>{
    mode= "computer";
    document.getElementById("x").innerHTML =
        `Computer: <span id="xScore">${xScore}</span>`;
    start.classList.add("hide");
    resetGame();
});

const winPatterns =[
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
];

const resetGame = () => {
    turnO = true;
    winner = false;
    cnt = 0;

    conatiner.classList.remove("hide");
    start.classList.add("hide");
    winCont.classList.add("hide");
    resetbtn.classList.remove("hide");
    exitbtn.classList.remove("hide"); 

    enableAllBtns();
    
    if(mode === "friend"){
        pl.innerHTML = "Player O's chance";
    }
    else if(mode ==="computer"){
        pl.innerHTML = "You (O) VS Computer (X)";
    }
    
};

newbtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);

const disableAllBtns = () => {
    for(let box of boxes){
        box.disabled = true;
    }
};

const enableAllBtns = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (val) => {
    resetbtn.classList.add("hide");
    winCont.classList.remove("hide");
    pl.innerHTML = "";
    disableAllBtns(); 

    if(mode ==="friend"){
        document.getElementById("output").innerText= `Congratulations, Player ${val} wins!`;
    }
    else if(mode === "computer"){
        if(val === "O"){
            document.getElementById("output").innerText= `Congratulations! You Won`;
        }
        else if(val === "X"){
            document.getElementById("output").innerText= `You lose - Better luck next time!`;
        }
    }

    if(val === "O"){
        oScore++;
        document.getElementById("oScore").innerText = oScore;
    } else {
        xScore++;
        document.getElementById("xScore").innerText = xScore;
    }
};

const checkWinner = () => {
    for(let pattern of winPatterns){
        let val1 = boxes[pattern[0]].innerText;
        let val2 = boxes[pattern[1]].innerText;
        let val3 = boxes[pattern[2]].innerText;

        if(val1 !== "" && val2 !== "" && val3 !== ""){
            if(val1 === val2 && val1 === val3){
                winner = true;
                showWinner(val1);
                return;
            }
        }
    }
};

const checkDraw = () => {
    if(cnt === 9 && !winner){
        drawScore++;
        document.getElementById("drawScore").innerText = drawScore;

        document.getElementById("output").innerText= `Draw! No winner.`;
        pl.innerText = "";

        resetbtn.classList.add("hide");
        winCont.classList.remove("hide");
        disableAllBtns();
    }
}

const findBestMove = (player) => {
    for(let pattern of winPatterns){
        let [a,b,c] = pattern;

        let vals = [
            boxes[a].innerText,
            boxes[b].innerText,
            boxes[c].innerText
        ];

        // 2 same + 1 empty
        if(vals.filter(v => v === player).length === 2 &&
           vals.includes("")){
            
            if(boxes[a].innerText === "") return a;
            if(boxes[b].innerText === "") return b;
            if(boxes[c].innerText === "") return c;
        }
    }
    return null;
};

const computerMove = () => {

    // Try to WIN
    let move = findBestMove("X");

    // Block player
    if(move === null){
        move = findBestMove("O");
    }

    // Take center
    if(move === null && boxes[4].innerText === ""){
        move = 4;
    }

    // Take random corner/side
    if(move === null){
        let empty = [];
        boxes.forEach((box,i)=>{
            if(box.innerText === "") empty.push(i);
        });

        move = empty[Math.floor(Math.random()*empty.length)];
    }

    if(move === undefined) return;

    boxes[move].innerText = "X";
    boxes[move].disabled = true;
    cnt++;

    checkWinner();
    checkDraw();
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(mode === "friend"){
            if(turnO){
                pl.innerHTML = "Player X's chance";
                box.innerText = "O";
                turnO = false;
            }
            else{
                pl.innerHTML = "Player O's chance";
                box.innerHTML = "X";
                turnO = true;
            }
            box.disabled = true;
            cnt++;
            checkWinner();
            if(!winner) checkDraw();
        }
        else if(mode === "computer"){
            box.innerText = "O";
            box.disabled = true;
            cnt++;

            checkWinner();
            checkDraw();

            // Computer move if game not over
            if(!winner && cnt < 9){
                setTimeout(() => {
                    computerMove();
                }, 300); 
            }
        }
    });
})

