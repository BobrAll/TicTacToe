class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Zone {
    constructor(x1, y1, x2, y2) {
        this.startPoint = new Point(x1, y1);
        this.endPoint = new Point(x2, y2);

        this.width = x2 - x1;
        this.height = y2 - y1;
        this.center = new Point(x1 + this.width / 2, y1 + this.height / 2);

        this.mark = undefined;
    }
    isHit(point) {
        return (point.x >= this.startPoint.x && point.x <= this.endPoint.x && 
            point.y >= this.startPoint.y && point.y <= this.endPoint.y) ? true : false;
    }
}
class TicTacToe {
    constructor(cells) {
        this.canvas = document.getElementById("TicTacToe");
        this.context = this.canvas.getContext("2d");
        
        this.isUserOneTurn = true;
        this.winner = undefined;

        this.cells = cells;
        this.zones = this.createZones();
        
        this.drawGrid();
    }
    getHittedZone(point) {
        for (let i = 0; i < this.cells; i++) {
            for (let j = 0; j < this.cells; j++) {
                if (this.zones[i][j].isHit(point)) return this.zones[i][j];
            }   
        }
    }
    createZones() {
        let cell_width = this.canvas.width / this.cells;
        let cell_height = this.canvas.height / this.cells;

        let zones = new Array(this.cells);
        for (let i = 0; i < this.cells; i++) zones[i] = new Array(this.cells);

        for (let i = 0; i < this.cells; i++)
            for (let j = 0; j < this.cells; j++)
                zones[i][j] = new Zone(cell_width * j, cell_height * i, cell_width * (j + 1), cell_height * (i + 1));

        return zones;
    }
    checkMarkForWin(mark) {
        for (let i = 0; i < this.cells; i++) {
            for (let j = 0; j < this.cells; j++) {
                if (this.zones[i][j].mark != mark) break;
                if (j == this.cells - 1) {
                    this.drawWinnerLine(this.zones[i][0], this.zones[i][j]);
                    return true;
                }
            }
        }
        
        for (let i = 0; i < this.cells; i++) {
            for (let j = 0; j < this.cells; j++) {
                if (this.zones[j][i].mark != mark) break;
                if (j == this.cells - 1) {
                    this.drawWinnerLine(this.zones[0][i], this.zones[j][i]);
                    return true;
                }
            }
        }

        for (let i = 0; i < this.cells; i++) {
            if (this.zones[i][i].mark != mark) break;
                if (i == this.cells - 1) {
                    this.drawWinnerLine(this.zones[0][0], this.zones[i][i]);
                    return true;
                }
        }

        for (let i = 0; i < this.cells; i++) {
            if (this.zones[i][this.cells - i - 1].mark != mark) break;
                if (i == this.cells - 1) {
                    this.drawWinnerLine(this.zones[i][0], this.zones[0][i]);
                    return true;
                }
        }
    }
    drawGrid() {
        this.context.lineWidth = 3;
        this.context.strokeStyle = "black";

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();

        //vertical lines
        for (let i = 1; i < this.cells; i++) {
            this.context.moveTo(this.canvas.width / this.cells * i, 0);
            this.context.lineTo(this.canvas.width / this.cells * i, this.canvas.height);
        }
        
        //horizontal lines
        for (let i = 1; i < this.cells; i++) {
            this.context.moveTo(0 , this.canvas.height / this.cells * i);
            this.context.lineTo(this.canvas.width, this.canvas.height / this.cells * i);
        }
    
        this.context.stroke();
    }
    drawCircle(zone) {
        let inner_gap_percent = 15;
        let gap = zone.width / 100 * inner_gap_percent;
        let radius = zone.width / 2 - gap;
        
        this.context.lineWidth = 5;
        this.context.strokeStyle = "black";

        this.context.beginPath();
        this.context.arc(zone.center.x, zone.center.y, radius, 0, Math.PI * 2);
        this.context.stroke();
    }
    drawCross(zone) {
        let inner_gap_percent = 20;
        let gap = zone.width / 100 * inner_gap_percent;
        
        this.context.lineWidth = 5;
        this.context.strokeStyle = "black";

        this.context.beginPath();
        this.context.moveTo(zone.startPoint.x + gap, zone.startPoint.y + gap);
        this.context.lineTo(zone.endPoint.x - gap, zone.endPoint.y - gap);
        this.context.moveTo(zone.startPoint.x + gap, zone.endPoint.y - gap);
        this.context.lineTo(zone.endPoint.x - gap, zone.startPoint.y + gap);
        this.context.stroke();
    }
    drawWinnerLine(startZone, endZone) {
        this.context.lineWidth = 3;
        this.context.strokeStyle = "red";
        this.context.beginPath();

        this.context.moveTo(startZone.center.x, startZone.center.y);
        this.context.lineTo(endZone.center.x, endZone.center.y);
        this.context.stroke();
    }
}

let game = new TicTacToe(3);
let range = document.getElementById("cells");

game.canvas.addEventListener("mousedown", function(event){
    event.preventDefault();
    let zone = game.getHittedZone(new Point(event.offsetX, event.offsetY));
    
    if (zone.mark == undefined) {
        if (game.isUserOneTurn) {
            game.drawCross(zone);
            zone.mark = "cross";
        }
        else {
            game.drawCircle(zone);
            zone.mark = "circle";
        }

        if (game.checkMarkForWin("cross")) game.winner = "first";
        if (game.checkMarkForWin("circle")) game.winner = "second";

        console.log(game.winner);
        game.isUserOneTurn = !game.isUserOneTurn;
    }
});

range.addEventListener("change", function(){
    game = new TicTacToe(range.value);
});