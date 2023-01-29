var board = [];
var rows = 8;
var columns = 8;

var minesCount = 10;
var minesLocation = [];          //id eller class för varje ruta ex. "1-2, 3-4 osv."

var tilesClicked = 0;          //när man trycker på en ruta värden går upp med 1
var flagEnabled = false;       //när man trycker på flaggan den byter värde till true

var gameOver = false;          //ifall gameOver = true spelet slutas och man kan inte trycka något mer. (kanske gör en restart button senare)

window.onload = function()    //ska genomföra det direkt efter sidan laddas klart
{
    startGame();
}

function setMines()          //ställer ut miner och jag skriver id där minerna ska vara
{
    /*minesLocation.push("0-0");
    minesLocation.push("0-1");
    minesLocation.push("3-5");
    minesLocation.push("1-2");*/

    let minesLeft = minesCount; //skapar en random number generator
    while (minesLeft > 0) 
    {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id))
        {
            minesLocation.push(id);
            minesLeft -= 1; //det finns en chans att en id för en bomb blir skapad två ggr därför jag ändrar den genom -1
        }
    }
        
}

function startGame() //startar de funktioner när spelet börjas
{ 
    setMines();
    document.getElementById("mine-count").innerText = minesCount; //ta elementen mine-count och byt ut den mot minesCount
    document.getElementById("flag-button").addEventListener("click", setFlag); //startar d
}

for (let r = 0; r < rows; r++) {  //skapar id rows för 8st
    let row = [];
    for (let c = 0; c < columns; c++) {  //skapar id columner för 8st
        
        let tile = document.createElement("div"); //skapar id
        tile.id = r.toString() + "-" + c.toString(); //tile.id kopplar ihop row delen och column delen
        tile.addEventListener("click", clickTile);
        document.getElementById("board").append(tile);
        row.push(tile);
    }
    board.push(row);
    
}
console.log(board); //gör så att jag kan se det i consolen.


function setFlag() {
    if (flagEnabled)
    {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else
    { 
        
    flagEnabled = true;
    document.getElementById("flag-button").style.backgroundColor = "darkgrey";
    
    }
}

function clickTile ()
{
    if (gameOver || this.classList.contains("tile-clicked"))//ifall det är true 
    {
        return;
    } //den skickar något tillbaka och kommer inte göra allt som står nedanför

    let tile = this; //referar till rutan som blev tryckt
    if (flagEnabled)
    {
        if (tile.innerText == "") //ifall det finns ingen text på rutan så kan man placera flagga på den
        {
            tile.innerText = "🚩" //och då placeras flaggan
        }
        else if (tile.innerText == "🚩") //ifall det finns flaga på rutan så kan man ta bort den
        {
            tile.innerText = ""; //så kan man ta bort den
        }
        return;
    }

    if (minesLocation.includes(tile.id))//ifall minesLocation har tile.id true då har man gått på en bomb och då är det game over. Förklarar hur det funkar längre ner
    {
        //alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }
    /*tex. ifall id är "0-0" då kommer den divideras med en streck och sen returnera 
     en array med två siffror ["0", "0"] som är strings*/
    let coords = tile.id.split("-"); 
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines()//gör så att man ser miner
{
    for (let r = 0; r < rows; r++) //den går igenom rutor först i rows
    {
        for (let c = 0; c < columns; c++) //sen columner
        {
            let tile = board[r][c];              //Array.prototype.includes(tile.id) ifall värden i parentesen stämmer då "includes" returnerar värde true
            if (minesLocation.includes(tile.id)) //ifall minesLocation includerar tile.id och den är true då visar alla andra värde där tile.id är true med bomb
            {
                tile.innerText = "💣";           
                tile.style.backgroundColor = "red";
            }
        }
    }
        
    
}

function checkMine(r, c) //ska checka igenom miner
{
    
    if(r < 0 || r >= rows || c < 0 || c >= columns)
    {
        return;
    }
    if(board[r][c].classList.contains("tile-clicked"))
    {
        return;
    }

    board[r][c].classList.add("tile-clicked"); //ändrar färg på rutan som är redan tryckt. Den plockar klassen från style.css
    tilesClicked += 1; //när man trycker på en ruta utan en bomb så höjs den med 1. När alla rutor är tryckta så vinner man.

    let minesFound = 0; //antal hittade miner     /*jag ska gå igenom rutorna runt om bomben. Jag chechar rutor runt de*/ 

    //top 3
    minesFound += checkTile(r-1, c-1); //top left 
    minesFound += checkTile(r-1, c); //top
    minesFound += checkTile(r-1, c+1); //top right

    //left and right
    minesFound += checkTile(r, c-1); //left
    minesFound += checkTile(r, c+1); //right

    //bottom
    minesFound += checkTile(r+1, c-1); //bottom left
    minesFound += checkTile(r+1, c); //bottom 
    minesFound += checkTile(r+1, c+1); //bottom right

    if(minesFound > 0) //ifall antal bomber är större än 0
    {
        board[r][c].innerText = minesFound; //då ritar upp siffror 1, 2, 3 osv.
        board[r][c].classList.add("b" + minesFound.toString()); //ändrar färg på siffran beroende på hur många bomber det  är. Tar det från style.css dokument
    }
    else //ifall man hittade inga miner i närheten så ska rutan fråga andra rutor runt om kring att checka ifall det finns miner nära de.
    {
        //top 3
        checkMine(r-1, c-1); //top left
        checkMine(r-1, c);  //top
        checkMine(r-1, c+1); //top right

        //left and right
        checkMine(r, c-1); //left
        checkMine(r, c+1); //right
        
        //bottom
        checkMine(r+1, c-1); //bottom left
        checkMine(r+1, c);  //bottom
        checkMine(r+1, c+1); //bottom right

    }

    if (tilesClicked == rows * columns - minesCount)//antal rutor är rows gånger columns -antal miner
    { //när alla rutor är trycka så vinner man
        document.getElementById("mine-count").innerText = "Cleared"
        gameOver = true;
    }
}

function checkTile(r, c) //checkar rutor genom deras id.
{
    if(r < 0 || r >= rows || c < 0 || c >= columns) //ifall man hittar ingenting då returnera värde 0.
    {
        return 0;
    }

    if (minesLocation.includes(r.toString() + "-" + c.toString())) //ifall man hittade en bomb nära returnera värde 1
    {
        return 1;
    }
    return 0;
}
//just nu så finns det en bug i spelet. När jag öppnar alla miner så står inte det "cleared vid mine-count" jag vet inte varför
