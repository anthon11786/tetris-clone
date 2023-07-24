
class Arena { 

    constructor(width, height) {
        const matrix = [];
        while (height--) {
            matrix.push(new Array(width).fill(0));
        }
        this.matrix = matrix; 
    };

    // Check if rows are completed 
    sweep() {
        let rowCount = 1; 
        outer: for (let y = this.matrix.length -1; y > 0; y--) {
            for (let x = 0; x < this.matrix[y].length; ++x) {
                // Check if any of rows have a zero, if it does not fully complete then
                if (this.matrix[y][x] === 0) {
                continue outer; 
                }

            }
            const row = this.matrix.splice(y, 1)[0].fill(0); // takes rows out of this.matrix, and fills it with 0 
            this.matrix.unshift(row); // append empty row to the top
            y++; 
            
            player.score += rowCount; 
            // rowCount *= 2; 
        }
    };

    clear() { 
        this.matrix.forEach(row => row.fill(0));
    }
}