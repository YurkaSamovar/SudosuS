"use strict";

const newGameBtn = document.getElementById("new_game_btn");
const deleteBtn = document.getElementById("delete_btn");
const celluls = document.getElementsByClassName("cellules");
const checkBtn = document.getElementById("check_btn");
const numbs = document.getElementsByClassName("numbs");
const textPres = document.getElementById("text_présentation");
const btnPres = document.getElementById("btn_présentation");
const attention = document.getElementById("attention");
const nomDeJoueurMod = document.getElementById("nom_de_joueur_mod");
const xSimbol = document.getElementById("x_simbol");
const ouiBtn = document.getElementById("btn_oui");
const nonBtn = document.getElementById("btn_non");
const newGameMod = document.getElementById("new_game_window_mod");
const nomDeJoueur = document.getElementById("nom_joueur");
const scoreDeJoueur = document.getElementById("score_de_joueur");

const colors = {
    select: "#4058cd",
    notSelect: "#1c1a43",
    boxShadow: "0 0 5px #dadbf3",
    boxShadowNon: "4px 4px 1px black",
    erreur: "#ff3a6f"
}

let selectedBtn = {
    id: undefined,
    content: undefined
};

let mainArray; //главный массив
let score = 0;

newGameBtn.addEventListener("click", function() {
    if(textPres.value === "") {
        nomDeJoueurMod.style.display = "flex";
    } else {
        newGameMod.style.display = "flex";
    }
});

ouiBtn.addEventListener("click", function() {
    newGameMod.style.display = "none";
    mainArray = swapCellules(creatGameArray());
    cleanForNewGame(celluls, selectedBtn, numbs);
    fillLeftField(mainArray);
    hideNumb();
    changeDisabled();
    score = 0;
    scoreDeJoueur.textContent = score;
});

nonBtn.addEventListener("click", function() {
    newGameMod.style.display = "none";
});

btnPres.addEventListener("click", function() {
    if(textPres.value === "") {
        attention.style.display = "inline";
        setTimeout(function() {
            attention.style.display = "none";
        }, 2000);
    } else {
        console.log("suka");
        nomDeJoueur.innerText = textPres.value;
        nomDeJoueurMod.style.display = "none";
        attention.style.display = "none";
        mainArray = swapCellules(creatGameArray());
        cleanForNewGame(celluls, selectedBtn, numbs, score);
        fillLeftField(mainArray);
        hideNumb();
        changeDisabled();
        score = 0;
        scoreDeJoueur.innerText = score;
    }
})

xSimbol.addEventListener("click", function() {
    nomDeJoueurMod.style.display = "none";
    attention.style.display = "none";
})

deleteBtn.addEventListener("click", function() {
    selectedBtn = changeSelected(deleteBtn, selectedBtn);
    selectedBtn.content = "";
})

checkBtn.addEventListener("click", function() {
    checkValue(mainArray, celluls);
})

for(let temp of numbs) {
    temp.addEventListener("click", function() {
        selectedBtn = changeSelected(temp, selectedBtn);
        selectedBtn.content = temp.textContent;
    });
}

for(let temp of celluls) {
    temp.addEventListener("click", function() {
        if(selectedBtn.content !== undefined && temp.hasAttribute("variable")) {
            if(selectedBtn.content === "" && temp.hasAttribute("variable") && temp.textContent !== "") {
                score -= 25;
                scoreDeJoueur.textContent = score;
                temp.textContent = selectedBtn.content;
                temp.style.backgroundColor = colors.notSelect;
            }

            if(temp.textContent !== "" && selectedBtn.content !== "") {
                if(temp.textContent !== selectedBtn.content) {
                    score -= 25;
                    scoreDeJoueur.textContent = score;
                    temp.textContent = selectedBtn.content;
                    temp.style.backgroundColor = colors.select;
                }
            } else if(selectedBtn.content !== "") {
                score += 15;
                scoreDeJoueur.textContent = score;
                temp.textContent = selectedBtn.content;
                temp.style.backgroundColor = colors.select;
            }
        }

        if(score < 0) {
            scoreDeJoueur.style.color = colors.erreur;
        } else {
            scoreDeJoueur.style.color = "limegreen";
        }
    });
}
// Создает заполненный игровой массив
function creatGameArray() {
    let arrNumb = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let arrCellules = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let arrGameField = [[], [], [], [], [], [], [], [], []];
    let tempNumb, tempCell;
    let pointerBlock = {};

    for(let i = 0; i < 9; i++) {
        tempNumb = getTemp(arrNumb);
        tempCell = getTemp(arrCellules);
        pointerBlock = getPointer(tempCell);//указатель на квадрат 3х3
        //заполнение куба 3х3
        for(let j = 0; j < 3; j++) {
            fillRow(pointerBlock.row, pointerBlock.column, tempNumb, arrGameField); //заполнение одной строки в кубе
            pointerBlock.row += 3;
            pointerBlock.column = pointerBlock.column % 3 === 0 ? pointerBlock.column - 2 : pointerBlock.column + 1;
        }
    }
    return arrGameField; //возвращаем готовый массив
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//возвращаем цифру и удаляем ее из массива
function getTemp(arr) {
    let temp;

    temp = arr[getRandomNumber(0, arr.length)];
    arr.splice(arr.indexOf(temp), 1);

    return temp;
}
//получение указателя на куб 3х3
function getPointer(tempCell) {
    let row, column;

    if(tempCell <= 3){
        row = 1;
        column = tempCell;
        return {row: row, column: column};
    } else if(tempCell > 3 &&  tempCell <= 6) {
        row = 2;
        column = tempCell - 3;
        return {row: row, column: column};
    } else {
        row = 3;
        column = tempCell - 6;
        return {row: row, column: column};
    }
}
//заполнение строки в кубе 3х3
function fillRow(row, column, tempNumb, mass) {
    for(let i = 0; i < 3; i++) {
        mass[row-1][column - 1] = tempNumb;
        row = row % 3 === 0 ? row - 2 : row + 1;
        column = column % 3 === 0 ? column + 1 : column + 4;
    }
}

function swapCellules(array) {
    let lengthOfChanges =  getRandomNumber(6, 15);
    let arrCells;
    let ranBlock, ranCellFirst, ranCellSecond;

    for(let i = 0; i < lengthOfChanges; i++) {
        arrCells = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
        ranBlock = getRandomNumber(0, arrCells.length);
        ranCellFirst = arrCells[ranBlock][getRandomNumber(0, arrCells[ranBlock].length)];
        arrCells[ranBlock].splice(arrCells[ranBlock].indexOf(ranCellFirst), 1);
        ranCellSecond = arrCells[ranBlock][getRandomNumber(0, arrCells[ranBlock].length)];

        for(let j = 0; j < 9; j++) {
            array[ranCellFirst][j] = array[ranCellFirst][j] + array[ranCellSecond][j];
            array[ranCellSecond][j] = array[ranCellFirst][j] - array[ranCellSecond][j];
            array[ranCellFirst][j] = array[ranCellFirst][j] - array[ranCellSecond][j];
        }
        for(let j = 0; j < 9; j++) {
            array[j][ranCellFirst] = array[j][ranCellFirst] + array[j][ranCellSecond];
            array[j][ranCellSecond] = array[j][ranCellFirst]- array[j][ranCellSecond];
            array[j][ranCellFirst] = array[j][ranCellFirst] - array[j][ranCellSecond];

        }
    }

    return array;
}

//заполнение левого игрового поля
function fillLeftField(array) {
    let celluleNumb = 1;
    for(let i = 0; i < 9; i++) {
        for( let j = 0; j < 9; j++) {
            document.getElementById(`cellule-${celluleNumb++}`).textContent = array[i][j];
        }
    }
}
//прячем цифрв в левом игровом поле
function hideNumb() {
    let cellulesHide, numb, arrNumb;

    for(let i = 0; i < 9; i++) {
        cellulesHide = getRandomNumber(4, 6);
        arrNumb = [1, 2, 3, 4, 5, 6, 7, 8, 9];


        for(let j = 0; j < cellulesHide; j++) {
            numb = arrNumb[getRandomNumber(0, arrNumb.length)];
            arrNumb.splice(arrNumb.indexOf(numb), 1);

            document.getElementById(`cellule-${(i * 9) + numb}`).innerText = "";
            document.getElementById(`cellule-${(i * 9) + numb}`).setAttribute("variable", "");
        }
    }
}

function changeDisabled() {
    for(let temp of document.querySelectorAll("[disabled]")) {
        temp.removeAttribute("disabled");
    }
}

function changeSelected(temp, selBtn) {
    if(selBtn.id === undefined) {
        selBtn.id = temp.id;
        document.getElementById(selBtn.id).style.backgroundColor = colors.select;
        document.getElementById(selBtn.id).style.boxShadow = colors.boxShadow;
    } else {
        document.getElementById(selBtn.id).style.backgroundColor = colors.notSelect;
        document.getElementById(selBtn.id).style.boxShadow = "";
        document.getElementById(temp.id).style.backgroundColor = colors.select;
        document.getElementById(temp.id).style.boxShadow = colors.boxShadow;
        selBtn.id = temp.id;
    }

    return selBtn;
}

function cleanForNewGame(cells, selBtn, numb) {
    for(let temp of cells) {
        temp.removeAttribute("variable");
        temp.style.backgroundColor = colors.notSelect;
    }

    for(let temp of numb) {
        temp.style.boxShadow = colors.boxShadowNon;
    }

    if(selBtn.id !== undefined) {
        document.getElementById(selBtn.id).style.backgroundColor = colors.notSelect;
    }

    selBtn.id = undefined;
    selBtn.content = undefined;
}

function checkValue(arr, cells) {
    let pointer = 0;
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            if(arr[i][j] !== Number(cells[pointer].textContent) && cells[pointer].textContent !== "" ) {
                cells[pointer].style.backgroundColor = colors.erreur;
            }
            pointer++;
        }
    }
}
