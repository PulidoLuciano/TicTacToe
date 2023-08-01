const Player = (option) => {
    const getOption = () => option;

    return{getOption};
 }

const playerOne = Player("X");
const playerTwo = Player("O");
 
 const Gameboard = (function(playerOne, playerTwo){
    let board = ["","","","","","","","",""];
    let current = playerTwo;
    let finished = false;

    const turn = function(cell){
        if(board[cell] == "" && !finished){
            current = (current == playerOne) ? playerTwo : playerOne;
            return setCell(current.getOption(), cell);
        }
        return "";
    }

    const setCell = function(player, cell){
        board[cell] = player;
        return player;
    }

    const verify = function(){
        
        for(let i = 0; i < 3; i++){
            let row = board[3*i+1];
            let column = board[i];
            
            //verify rows
            if(row == board[3*i] && row == board[3*i+2] && row != "") {
                finished = true;
                return row;
            }
            //verify columns
            if(column == board[i+3] && column == board[i+6] && column != ""){
                finished = true;
                return column;
            } 
        }

        //verify diagonal
        if(board[0] != "" && board[0] == board[4] && board[0] == board[8]){
            finished = true;
            return board[0];
        } 
        if(board[2] != "" && board[2] == board[4] && board[2] == board[6]){
            finished = true;
            return board[2];
        } 
        
        if(!board.includes("")){
            finished = true;
            return "D";
        } 

        return "";
    }

    const resetBoard = function(){
        board = board.map(x => x = "");

        finished = false;
    }

    const getFinished = () => finished;

    return{
        turn,
        verify,
        resetBoard,
        getFinished
    }
 })(playerOne, playerTwo);

const DOMDrawer = (function(doc, game){
    
    const cells = [...doc.querySelectorAll(".cell")];
    const elementX = `<div class="option x">X</div>`;
    const elementO = `<div class="option o">O</div>`;
    
    const getCell = (element) => {
        return parseInt(element.id);
    }

    const showWinner = (state)=> {
        if(state == "") return;

        let winnerMessage = doc.querySelector("#message-winner");

        let h2 = document.createElement("h2");

        if(state == "D") h2.textContent = "It's a DRAW";
        else h2.textContent = "The winner is " + state;

        winnerMessage.appendChild(h2);
        winnerMessage.classList.toggle("hidden");
    }

    const addEvents = () => {
        
        cells.forEach(cell => {
            cell.addEventListener("click", (event) => {
                let draw = game.turn(getCell(cell));
                event.target.innerHTML = (draw == "") ? event.target.innerHTML : (draw == "X") ? elementX : elementO;
                if(!game.getFinished()) showWinner(game.verify());
            });
        });

        const buttonReset = doc.querySelector("#button-reset");

        buttonReset.addEventListener("click", () =>{
            cells.forEach(element => {
                element.innerHTML = "";
            });
            game.resetBoard();

            let winnerMessage = doc.querySelector("#message-winner");
            winnerMessage.innerHTML = "";
        })
    }
    
    return{
        addEvents
    }
})(document, Gameboard);

DOMDrawer.addEvents();

