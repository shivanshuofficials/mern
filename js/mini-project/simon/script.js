let gamesq = []
let usersq = [];
let started = false
let level = 0

let btns = ["yellow", "red", "purple", "green"]

let h2 = document.querySelector("h2")

document.addEventListener("keypress", function () {
    if (started == false) {
        console.log("game is started")
        started = true;
        levelup();
    }
})

function btnflash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}
function userflash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 250);
}

function levelup() {
    usersq = []
    level++;
    h2.innerText = `Level ${level}`;

    let randomidx = Math.floor(Math.random() * 4);
    let randomcolor = btns[randomidx];
    let newbtn = document.querySelector(`.${randomcolor}`)
    gamesq.push(randomcolor)
    btnflash(newbtn);
}

function checkans(idx) {

    if (usersq[idx] == gamesq[idx]) {
        if (usersq.length == gamesq.length) {
            setTimeout(levelup, 1000);
        }
    }
    else {
        h2.innerHTML = `Game Over! Your score was <b>${level}</b>.<br> Press any Key to Start.`
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        reset()
    }

}

function btnspress() {
    let btn = this;
    console.log("pressed");

    userflash(btn)
    usercolor = btn.getAttribute("id")
    usersq.push(usercolor);
    console.log(usercolor);

    checkans(usersq.length - 1)
}

let allbtns = document.querySelectorAll(".btn")

for (btn of allbtns) {
    btn.addEventListener("click", btnspress)
}

function reset(params) {
    started = false
    gamesq = []
    usersq = []
    level = 0
}