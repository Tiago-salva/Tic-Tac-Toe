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

//Function Facotry for the player
const createPlayer = (name, symbol) => {
    return { name, symbol };
};

//Module for the game
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

    //Function to get the best move
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
        //If no winner, return false
        return false
    }

    function checkDraw(board) {
        function isBoardFull(board) {
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (board[row][col] === "") {
                        return false; // Found an empty cell, the board it's not full
                    }
                }
            }
            return true; // There is not empty cells, the board it's full
        }
        
        //Check for a draw / tie
        if (isBoardFull(board) && (checkWinner(board) === false)) {
            return true
        } else {
            return false
        }
    }

    //Function to check which player won
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

    //Reset the board
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


//Module to control the screen
const screenController = ((gameController) => {

    let opponentOption;
    //Get visual elements
    const whatDifficultyText = document.querySelector(".what-difficulty");
    const opponentBtns = document.querySelectorAll("#opponent-btn");
    const chooseOpponentContainer = document.querySelector(".choose-opponent-container");
    //Get who is the opponent
    opponentBtns.forEach((button) => {
        button.addEventListener("click", () => {
            opponentOption = button.getAttribute("data-attribute");
            opponentOption = parseInt(opponentOption);
            chooseOpponentContainer.style.visibility = "hidden";
            //If the opponent it's IA, show the difficulty text
            if (opponentOption === 2) {
                whatDifficultyText.style.visibility = "visible";
            }
            return opponentOption
        })
    })
    
    //Buttno to restart the game
    const restartBtn = document.getElementById("restart-btn");
    restartBtn.addEventListener("click", () => {
        gameController.restartBoard();
        updateBoardUI();
    });

    //Event Listener to show the three difficultys
    const showDifficultyBtn = document.getElementById("select-difficulty-btn");
    const difficultyBtnContainer = document.querySelector(".choose-difficulty");
    showDifficultyBtn.addEventListener("click", () => {
        difficultyBtnContainer.classList.toggle("showed");
    });

    //Default difficulty
    let difficultyNumber = 2;
    
    //When a difficulty it's selected, the text it's updated and the board restarted
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

    //Function to show who won
    const showWinner = () => {
        //Get the neccessary elements
        const blur = document.querySelector(".blur");
        const showWinnerContainer = blur.querySelector(".show-winner");
        const winnerTitle = blur.querySelector(".winner-title");
        const winnerSymbol = blur.querySelector(".winner-symbol");

        blur.classList.add("display");
        showWinnerContainer.classList.add("active");

        //When the overlay it's clicked, remove it and restart the game
        blur.addEventListener("click", () => {
            blur.classList.remove("display");
            showWinnerContainer.classList.remove("active");

            gameController.restartBoard(board);
            
            updateBoardUI();
        });

        //Save in variables the return of the functions
        const checkResult = gameController.checkWinner(gameBoard.getBoard());
        const isDraw = gameController.checkDraw(gameBoard.getBoard());

        //Check if there is a winner or a tie
        if (checkResult === true) {
            winnerTitle.textContent = "The winner is";
            winnerSymbol.textContent = gameController.getCurrentPlayer().symbol;
        } else if (isDraw === true) {
            winnerTitle.textContent = "It's a draw!";
            winnerSymbol.textContent = "X O";
        }
    }

    //Function to update the board
    const updateBoardUI = () => {
        const board = gameBoard.getBoard();
        const allCells = document.querySelectorAll(".cell");

        allCells.forEach((cell, index) => {
            const row = cell.getAttribute("data-row");
            const col = cell.getAttribute("data-col");
            cell.textContent = board[row][col];
        });
    };

    //Function that control all the game
    const playRound = () => {
        const board = gameBoard.getBoard();

        let rowIndex, colIndex;

        const allCells = document.querySelectorAll(".cell");

        //Event Listener for all the cells
        allCells.forEach(cell => {
            cell.addEventListener("click", () => {
                let someoneWin, isDraw;

                //Infinite loop until someone win or there it's a tie
                while (true) {
                    
                    //Get the number of col and row of the cell
                    rowIndex = cell.getAttribute("data-row");
                    colIndex = cell.getAttribute("data-col");
    
                    //Get the symbol of the actual player
                    let symbol = gameController.getCurrentPlayer().symbol;
    
                    //If the cell it's full, try another move
                    if (board[rowIndex][colIndex] !== "") {
                        return
                    }
    
                    gameBoard.makeMove(rowIndex, colIndex, symbol);
                    updateBoardUI();
                    //Check if the game it's over
                    someoneWin = gameController.checkWinner(board);
                    isDraw = gameController.checkDraw(board);
                    if (someoneWin === true || isDraw === true) {
                        showWinner();
                        break
                    }

                    gameController.switchPlayer();
                    
                    //Check if the opponent it's the IA, 
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
                    }
                    //If the opponent it's another human, the loop start again
                }                
            });
        });
    };

    return { playRound }
})(gameController());

screenController.playRound();