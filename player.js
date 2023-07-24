
class Player {
    constructor() { 
        this.pos = {x:0 , y:0 };
        this.matrix = null; 
        this.score = 0;
        this.storedPiece = null; 
        this.direction = 0; // will hold -1 for left, 0 for none, 1 for right
        this.holdingTime = 0; // will hold the time in milliseconds a move key has been held down
        this.fastMoveInterval = 150;// after 150ms of holding, we speed up
        this.dropCounter = 0; // Decontaminate the drop counter from global scope 
        this.dropInterval = 1000; // every second we want to drop piece 
        
    };

    move(dir) {
        this.pos.x += dir; 
        if (collide(arena, this)) { 
          this.pos.x -= dir; 
        }
      }; 

    
    /**
     * Rotates the player piece in the specified direction,
     * and adjusts the position of the piece to avoid collisions
     * with the arena boundaries or other pieces. If no valid
     * position is found after the rotation, the rotation is undone.
     *
     * @param {number} dir - The direction of rotation. Typically, a value of 1 indicates
     * clockwise rotation, and -1 indicates counter-clockwise rotation.
     */
    rotate(dir) {
        const posX = this.pos.x;
        const posY = this.pos.y;
        let offset = 1;
    
        // Rotate the player's piece
        rotate(this.matrix, dir);
    
        // Check for collisions and adjust the player's position to avoid them
        while (collide(arena, this)) {
            this.pos.x += offset;
            this.pos.y += offset;
            offset = -(offset + (offset > 0 ? 1: -1));
    
            // If no valid position is found after rotation, undo the rotation
            if (offset > this.matrix[0].length) {
                rotate(this.matrix, -dir);
                this.pos.x = posX;
                this.pos.y = posY;
                return;
            }
        }
    }

    /**
     * Drops the tetronimo one second at a time from top of screen. Checks for collision each move
     */
    drop() {
        this.pos.y++;
      
        if (collide(arena, this)) {
            this.pos.y--; // it will collide so we move it right back where it touches and not overlaps. 
            merge(arena, this); // save the tetrimino where it collided  
            playerReset();
            arenaSweep();
            updateScore(); 
        }
      
        this.dropCounter = 0; // we dont want another drop we want that delay  
      }

    reset() {
        const pieces = 'TJLOSZI'; 
        this.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
        this.pos.y = 0; 
        this.pos.x = (arena[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0); 
        if (collide(arena, this)) { 
            arena.forEach(row => row.fill(0))
            this.score = 0; 
            this.storedPiece = null; 
            clearCanvas(storeContext, tetrominoStoreCanvas.width/20, tetrominoStoreCanvas.height/20);
            updateScore(); 
        }
    }

    update(deltaTime) {
        this.dropCounter += deltaTime; 
        if (this.dropCounter > this.dropInterval) {
            player.drop(); 
        }
    }
};