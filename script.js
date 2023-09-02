//Module
const gameBoard = (() => {

    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const getBoard = () => board;

    const makeMove = (row, column, symbol) => {
        board[row][column] = symbol;
        return true
    };

    return { getBoard, makeMove }

})();

//Function Facotry
const createPlayer = (name, symbol) => {
    return { name, symbol };
};

//Module
function gameController() {
    const playerOne = createPlayer("playerOne", "X");
    const playerTwo = createPlayer("playerTwo", "O");
    let currentPlayer = playerOne;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }

    const getCurrentPlayer = () => currentPlayer;

    const ComputerMove = (board, symbol, difficulty) => {
        let bestScore = -Infinity;
        let bestRow, bestCol

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = "O";
                    let score = minimax(board, difficulty, false);
                    board[i][j] = "";

                    if (score > bestScore) {
                        bestScore = score;
                        bestRow = i;
                        bestCol = j;
                    }
                }
            }
        }
        gameBoard.makeMove(bestRow, bestCol, symbol);
        return
    }

    const minimax = (board, depth, isMaximazing) => { 
        if (checkWhichPlayerWin(board, playerOne.symbol)) {
            return -100
        } else if (checkWhichPlayerWin(board, playerTwo.symbol)) {
            return 100
        } else if (checkDraw(board) === true) {
            return 0
        }

        if (depth === 0) {
            return 0 // Depth limit reached, return heuristic value
        }

        if (isMaximazing) {
            let bestScore = -Infinity;
    
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "") {
                        board[i][j] = "O";
                        let score = minimax(board, depth - 1, false);
                        board[i][j] = "";
    
                        bestScore = Math.max(bestScore, score);
                    }
                }
            }
            return bestScore
        } else {
            let bestScore = Infinity;
    
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "") {
                        board[i][j] = "X";
                        let score = minimax(board, depth - 1, true);
                        board[i][j] = "";
    
                        bestScore = Math.min(bestScore, score);
                    }
                }
            }
            return bestScore
        }
    }

    function checkWinner(board) {

        // Check rows for a winner
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
                return true
            }
        }

        // Check columns for a winner
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
                return true
            }
        }

        // Check diagonals for a winner
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
            return true
        }

        if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
            return true
        }

        return false
    }

    function checkDraw(board) {
        function isBoardFull(board) {
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (board[row][col] === "") {
                        return false; // Encontró una celda vacía, el tablero no está lleno
                    }
                }
            }
            return true; // No se encontraron celdas vacías, el tablero está lleno
        }
        
        
        if (isBoardFull(board) && (checkWinner(board) === false)) {
            return true
        } else {
            return false
        }
    }

    function checkWhichPlayerWin(board, symbol) {
        let thePlayerWin = false;
        
        // Check rows for a winner
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] === symbol) {
                thePlayerWin = true;
            }
        }

        // Check columns for a winner
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] === symbol) {
                thePlayerWin = true;
            }
        }

        // Check diagonals for a winner
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] === symbol) {
            thePlayerWin = true;
        }

        if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] === symbol) {
            thePlayerWin = true;
        }

        return thePlayerWin
    }

    const restartBoard = () => {
        const board = gameBoard.getBoard();
        currentPlayer = playerOne;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
        round = 0;
    }

    return { getCurrentPlayer, switchPlayer, checkWinner, checkDraw, checkWhichPlayerWin, restartBoard, ComputerMove };
};


//Module
const screenController = ((gameController) => {

    let opponentOption;
    const whatDifficultyText = document.querySelector(".what-difficulty");
    const opponentBtns = document.querySelectorAll("#opponent-btn");
    const chooseOpponentContainer = document.querySelector(".choose-opponent-container");
    opponentBtns.forEach((button) => {
        button.addEventListener("click", () => {
            opponentOption = button.getAttribute("data-attribute");
            opponentOption = parseInt(opponentOption);
            chooseOpponentContainer.style.visibility = "hidden";
            if (opponentOption === 2) {
                whatDifficultyText.style.display = "block";
            }
            return opponentOption
        })
    })

    const restartBtn = document.getElementById("restart-btn");
    restartBtn.addEventListener("click", () => {
        gameController.restartBoard();
        updateBoardUI();
    });

    const showDifficultyBtn = document.getElementById("select-difficulty-btn");
    const difficultyBtnContainer = document.querySelector(".choose-difficulty");
    showDifficultyBtn.addEventListener("click", () => {
        difficultyBtnContainer.classList.toggle("showed");
    });

    let difficultyNumber = 2;
    
    const difficultyBtns = document.querySelectorAll("#difficulty-btn");
    difficultyBtns.forEach((button) => {
        button.addEventListener("click", () => {
            const difficultyText = button.textContent;
            difficultyNumber = button.getAttribute("data-attribute");
            difficultyNumber = parseInt(difficultyNumber);
            difficultyBtnContainer.classList.remove("showed");
            whatDifficultyText.textContent = `Difficulty: ${difficultyText}`;
            gameController.restartBoard();
            updateBoardUI();
            return difficultyNumber
        })
    })

    const showWinner = () => {
        const blur = document.querySelector(".blur");
        const showWinnerContainer = blur.querySelector(".show-winner");
        const winnerTitle = blur.querySelector(".winner-title");
        const winnerSymbol = blur.querySelector(".winner-symbol");

        blur.classList.add("display");
        showWinnerContainer.classList.add("active");

        blur.addEventListener("click", () => {
            blur.classList.remove("display");
            showWinnerContainer.classList.remove("active");

            gameController.restartBoard(board);
            
            updateBoardUI();
        });

        const checkResult = gameController.checkWinner(gameBoard.getBoard());
        const isDraw = gameController.checkDraw(gameBoard.getBoard());

        if (checkResult === true) {
            winnerTitle.textContent = "The winner is";
            winnerSymbol.textContent = gameController.getCurrentPlayer().symbol;
        } else if (isDraw === true) {
            winnerTitle.textContent = "It's a draw!";
            winnerSymbol.textContent = "X O";
        }
    }

    const updateBoardUI = () => {
        const board = gameBoard.getBoard();
        const allCells = document.querySelectorAll(".cell");

        allCells.forEach((cell, index) => {
            const row = cell.getAttribute("data-row");
            const col = cell.getAttribute("data-col");
            cell.textContent = board[row][col];
        });
    };

    const playRound = () => {
        const board = gameBoard.getBoard();

        let rowIndex, colIndex;

        const allCells = document.querySelectorAll(".cell");

        allCells.forEach(cell => {
            cell.addEventListener("click", () => {
                let someoneWin, isDraw;

                while (true) {
                    
                    rowIndex = cell.getAttribute("data-row");
                    colIndex = cell.getAttribute("data-col");
    
                    let symbol = gameController.getCurrentPlayer().symbol;
    
                    if (board[rowIndex][colIndex] !== "") {
                        return
                    }
    
                    gameBoard.makeMove(rowIndex, colIndex, symbol);
                    updateBoardUI();
                    someoneWin = gameController.checkWinner(board);
                    isDraw = gameController.checkDraw(board);

                    if (someoneWin === true || isDraw === true) {
                        showWinner();
                        break
                    }

                    gameController.switchPlayer();
                    
                    if(opponentOption === 2) {
                        symbol = gameController.getCurrentPlayer().symbol;
                        gameController.ComputerMove(board, symbol, difficultyNumber);
                        updateBoardUI();
                        someoneWin = gameController.checkWinner(board);
                        isDraw = gameController.checkDraw(board);

                        if (someoneWin === true || isDraw === true) {
                            showWinner();
                            break
                        }

                        gameController.switchPlayer();    
                    } else {

                    }

                    
                    
                }                
            });
        });
    };

    return { playRound }
})(gameController());

screenController.playRound();








//Codigo que con IA sin minmax que funciona bien
////Module
// const gameBoard = (() => {

//     const board = [
//         ["", "", ""],
//         ["", "", ""],
//         ["", "", ""]
//     ];

//     const getBoard = () => board;

//     const makeMove = (row, column, symbol) => {
//         board[row][column] = symbol;
//         return true
//     };

//     return { getBoard, makeMove }

// })();

// //Function Facotry
// const createPlayer = (name, symbol) => {
//     return { name, symbol };
// };

// //Module
// function gameController() {
//     const playerOne = createPlayer("playerOne", "X");
//     const playerTwo = createPlayer("playerTwo", "O");
//     let currentPlayer = playerOne;

//     const switchPlayer = () => {
//         currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
//     }

//     const getCurrentPlayer = () => currentPlayer;

//     const ComputerMove = (board, symbol) => {
//         let computerRow, computerCol;

//         while (true) {
//             computerRow = Math.floor(Math.random() * 3);
//             computerCol = Math.floor(Math.random() * 3);

//             if (board[computerRow][computerCol] === "") {
//                 break;
//             }
//         }

//         gameBoard.makeMove(computerRow, computerCol, symbol);
//     }

//     let round = 0;

//     function checkWinner(board) {
//         let gameDraw = null;
//         round++

//         const checkBoard = () => {
//             // Check rows for a winner
//             for (let i = 0; i < 3; i++) {
//                 if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
//                     gameDraw = false;
//                 }
//             }

//             // Check columns for a winner
//             for (let i = 0; i < 3; i++) {
//                 if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
//                     gameDraw = false;
//                 }
//             }

//             // Check diagonals for a winner
//             if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
//                 gameDraw = false;
//             }

//             if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
//                 gameDraw = false;
//             }

//             return gameDraw
//         }

//         const checkAllDirections = checkBoard();
        

//         if ((round >= 9) && (checkAllDirections === null)) {
//             gameDraw = true;
//         }

//         return gameDraw;
//     }

//     const restartBoard = () => {
//         const board = gameBoard.getBoard();
//         currentPlayer = playerOne;
//         for (let i = 0; i < 3; i++) {
//             for (let j = 0; j < 3; j++) {
//                 board[i][j] = "";
//             }
//         }
//         round = 0;
//     }

//     return { getCurrentPlayer, switchPlayer, checkWinner, restartBoard, ComputerMove };
// };


// //Module
// const screenController = ((gameController) => {

//     const restartBtn = document.getElementById("restart-btn");
//     restartBtn.addEventListener("click", () => {
//         gameController.restartBoard();
//         updateBoardUI();
//     });

//     const showDifficultyBtn = document.getElementById("difficulty-btn");
//     const difficultyBtnContainer = document.querySelector(".choose-difficulty");
//     showDifficultyBtn.addEventListener("click", () => {
//         difficultyBtnContainer.classList.toggle("showed");
//     });

//     const showWinner = () => {
//         const blur = document.querySelector(".blur");
//         const showWinnerContainer = blur.querySelector(".show-winner");
//         const winnerTitle = blur.querySelector(".winner-title");
//         const winnerSymbol = blur.querySelector(".winner-symbol");

//         blur.classList.add("display");
//         showWinnerContainer.classList.add("active");

//         blur.addEventListener("click", () => {
//             blur.classList.remove("display");
//             showWinnerContainer.classList.remove("active");

//             gameController.restartBoard(board);
            
//             updateBoardUI();
//         });

//         const checkResult = gameController.checkWinner(gameBoard.getBoard());

//         if (checkResult === false) {
//             winnerTitle.textContent = "The winner is";
//             winnerSymbol.textContent = gameController.getCurrentPlayer().symbol;
//         } else if (checkResult === true) {
//             winnerTitle.textContent = "It's a draw!";
//             winnerSymbol.textContent = "X O";
//         }
//     }

//     const updateBoardUI = () => {
//         const board = gameBoard.getBoard();
//         const allCells = document.querySelectorAll(".cell");

//         allCells.forEach((cell, index) => {
//             const row = cell.getAttribute("data-row");
//             const col = cell.getAttribute("data-col");
//             cell.textContent = board[row][col];
//         });
//     };

//     const playRound = () => {
//         const board = gameBoard.getBoard();

//         let rowIndex, colIndex;

//         const allCells = document.querySelectorAll(".cell");

//         allCells.forEach(cell => {
//             cell.addEventListener("click", () => {
//                 let checkResult;

//                 while (true) {
                    
//                     rowIndex = cell.getAttribute("data-row");
//                     colIndex = cell.getAttribute("data-col");
    
//                     let symbol = gameController.getCurrentPlayer().symbol;
    
//                     if (board[rowIndex][colIndex] !== "") {
//                         return
//                     }
    
//                     gameBoard.makeMove(rowIndex, colIndex, symbol);
//                     updateBoardUI();
//                     checkResult = gameController.checkWinner(board);

//                     if (checkResult === true || checkResult === false) {
//                         showWinner();
//                         break
//                     }

//                     gameController.switchPlayer();
//                     symbol = gameController.getCurrentPlayer().symbol;
//                     gameController.ComputerMove(board, "O");
//                     updateBoardUI();
//                     checkResult = gameController.checkWinner(board);

//                     if (checkResult === true || checkResult === false) {
//                         showWinner();
//                         break
//                     }

//                     gameController.switchPlayer();
                    
//                 }                
//             });
//         });
//     };

//     return { playRound }
// })(gameController());

// screenController.playRound();