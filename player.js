
class Player {
    constructor() { 
        this.pos = {x:0 , y:0 };
        this.matrix = null; 
        this.score = 0;
        this.storedPiece = null; 
        this.direction = 0; // will hold -1 for left, 0 for none, 1 for right
        this.holdingTime = 0; // will hold the time in milliseconds a move key has been held down
        this.fastMoveInterval = 150;// after 150ms of holding, we speed up
        
    }
};