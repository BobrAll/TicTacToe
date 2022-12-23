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
    constructor() {
        this.canvas = document.getElementById("TicTacToe");
        this.context = this.canvas.getContext("2d");
        
        this.isUserOneTurn = true;
        this.winner = undefined;

        this.cells = 3;
        this.zones = this.createZones();
        
        this.drawGrid();
    }
    getHittedZone(point) {
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].isHit(point)) return this.zones[i];
        }
    }
    createZones() {
        let zones = [];
        let cell_width = this.canvas.width / this.cells;
        let cell_height = this.canvas.height / this.cells;
        
        for (let i = 0; i < this.cells; i++) {
            for (let j = 0; j < this.cells; j++) {
                zones.push(new Zone(cell_width * j, cell_height * i, cell_width * (j + 1), cell_height * (i + 1)));
            }   
        }

        return zones;
    }
    checkWinner() {
        for (let i = 0; i < this.cells; i++) {
            for (let j = 0; j < this.cells; j++) {
                //if 
            }
        }
    }
    drawGrid() {
        this.context.lineWidth = 3;
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
        this.context.beginPath();
        this.context.arc(zone.center.x, zone.center.y, radius, 0, Math.PI * 2);
        this.context.stroke();
    }
    drawCross(zone) {
        let inner_gap_percent = 20;
        let gap = zone.width / 100 * inner_gap_percent;
        
        this.context.lineWidth = 5;
        this.context.beginPath();
        this.context.moveTo(zone.startPoint.x + gap, zone.startPoint.y + gap);
        this.context.lineTo(zone.endPoint.x - gap, zone.endPoint.y - gap);
        this.context.moveTo(zone.startPoint.x + gap, zone.endPoint.y - gap);
        this.context.lineTo(zone.endPoint.x - gap, zone.startPoint.y + gap);
        this.context.stroke();
    }
    drawWinnerLine(lineType, startZone) {
        this.context.lineWidth = 3;
        this.context.strokeStyle = "red";
        this.context.beginPath();

        if (lineType == "row") {
            //moveTo(zone)
        }
    }
}

let game = new TicTacToe();

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

        game.checkWinner();
        game.isUserOneTurn = !game.isUserOneTurn;
    }
});
