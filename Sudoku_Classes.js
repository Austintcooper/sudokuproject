console.log("loaded objects");

// This class represents 1 of the 81 segments of the 9x9 sudoku grid
class SudokuSegment {
    constructor(value, posX, posY, quadrant) {
    this.value = value;
    this.posX = posX;
    this.posY = posY;
    this.quadrant = quadrant;
    }

    setValue(value) {
        this.value = value;
    }

    //This is for debugging. Will print info to console
    printInfo() {
        console.log("Value: "+this.value);
        console.log("Position X: "+this.posX);
        console.log("Position Y: "+this.posY);
        console.log("Quadrant: "+this.quadrant);
    }
    
    //Prints just the value to console
    printValue() {
        console.log("Value: "+this.value);
    }
}

// Class will make a new dimension squared sudoku grid
// Note!!! Dimension NEEDS to be a perfect square to generate a valid sudoku grids 
class SudokuGrid {
    constructor(dimension) {
        // Creates all required class variables
        this.gridArr = [];
        this.gridDimension = dimension;
        this.dimensionRoot = Math.sqrt(this.gridDimension);
        this.quadrantArray = [];
        // here we initialize an array containing all the bounds needed for quadrant generation
        for(let i = 0; i <= this.dimensionRoot; i++) {
            this.quadrantArray[i] = i*this.dimensionRoot;
        }
        // This loop will create dimension squared segments to fill the grid 
        for(let i = 0; i < dimension**2; i++) {
            // Segment class arguements are as follows: Value, Position X, Position Y, Quadrant
            // Value is the current number the segment is set to. 1-dimension with 0 representing an empty square
            // Pos X represents the column the segment is in, numbered akin to a graph in quadrant 4
            // Pos Y represents the row the segment is in, numbered akin to a graph in quadrant 4
            // Quadrant represents the dimension*dimension sub-grid the segment is in. quadrants are numbered as follows
            // using dimension = 9 as an example
            // 1|2|3
            // -----
            // 4|5|6
            // -----
            // 7|8|9
            //--------------------------------------------------------------------------------------------//
            var x = (i%dimension+1);
            var y = (Math.floor(i/dimension)+1);
            var defaultValue = 0;
            var quadrant = this.evaluateQuadrant(x,y);
            var segment = new SudokuSegment(defaultValue,x,y,quadrant)
            this.gridArr.push(segment);
        }    
    }

    evaluateQuadrant(xVal, yVal) {
        // Y offest is a way to determine what quadrant with math instead of nested conditionals
        // By taking the floor of y divided by dimension we can tell what fraction of the grid the coordinates fall in
        // where the denominator of said fraction is the root of dimension (i.e 1/2, 1/3, 1/4, 1/5)
        // By multiplying the result by dimension we give ourselves a whole number representing the denominator then adding this to the result in the conditional
        // Gives us our quadrant
        var yOffset = (Math.ceil(yVal/this.dimensionRoot)-1)*this.dimensionRoot;
        var returnVal = -1;
        for(let i = 0; i < this.quadrantArray.length; i++) {
            //console.log(xVal + ":" + yVal);
            if(xVal > this.quadrantArray[i] && xVal <= this.quadrantArray[i+1]) {
                //console.log("here");
                returnVal = i+1+yOffset;
            }
        }
        return returnVal;
    }

    // Prints each objoect to the console for debugging
    // Will look like this:
    // Segment {value: 0, posX: 1, posY: 1, quadrant: 1}
    printGrid() {
        for (let i = 0; i < this.gridArr.length; i++) {
            console.log(this.gridArr[i]);
        }
    }

    // Will print out every segment in a specified quadrant
    printQuadrant(quadrant) {
        //This is a brute force solution that simply checks every segment for their quadrant
        // Since there is no good solution without breaking the array order by sorting the array
        for(let i = 0; i < this.gridArr.length; i++) {
            let temp = this.gridArr[i];
            if(temp.quadrant == quadrant) {
                console.log(temp)
            }
        }
    }

    // Both printGrid and printQuadrant are proofs of concept for iterating through the segment array
    // The same approach will be used to then check if each quadrant/row/column satisfies the sudoku rules

    convertCoordToIndex(x, y) {
        // The math for this is as follows:
        // Our aray runs from 0-dimension^2
        // At a y of 0 x is equal to the index+1
        // By subtracting 1 from y then multiplying it by dimension we get a number that,
        // when added to x is index+1 for any y value
        // The first line gives us our index offset by 1
        // The return statement then adjusts it by 1 so that temp-1 = index 
        let temp = x+(this.gridDimension*(y-1));
        return temp-1;
    }

    // Returns the value of a segment by x and y coordinates
    // We will convert two coordinates into the equivilant array index
    getCoordValue(x, y) {
        return this.getIndexValue(this.convertCoordToIndex(x, y));
    }

    // Returns value of segment by array index instead of coordinate
    // Used in the coordinate value call, also easier to use when looping
    getIndexValue(n) {
        return this.gridArr[n].value;
    }

    // Sets the value of a segment by coordinate value
    setCoordValue(x, y, value) {
        this.setIndexValue(this.convertCoordToIndex(x, y), value)
    }

    // Sets the value of a segment by index value
    setIndexValue(n, value) {
        this.gridArr[n].setValue(value);
    }

    // This is the easiest part to check, as the array is organized in a way to facilitate this
    checkColumnComplete(column) {
        // All that needs to be done math wise is find the beginning index and end index of the row
        // Which can be done using the convertCoordToIndex function, and feeding it an x of 1 and dimension with y set to column
        let start = convertCoordToIndex(1, column);
        let end = convertCoordToIndex(this.gridDimension, column);
    }

    checkRowComplete(row) {
        let start = this.convertCoordToIndex(1, row);
        let end = this.convertCoordToIndex(this.gridDimension, row);
        
    }

    checkQuadrantComplete(quadrant) {
        
    }

    // This function will check an array to see if it contains exactly one occurence of the numbers 1-9
    // without needing to duplicate code in each function
    // We will have an array of empty booleans, and flip them on first occurence of each number.
    // should the number appear again we will break the loop and return an error
    arrayToCheck(array) {
        // Array needs to be populated with dimension number of booleans
        let checkerArray = [];
        // I imagine this is bad practice however i cannot think of a better way offhand to improve it       
        for(let i = 0; i < array.length; i++) {
            let numberToCheck = array[i];

        }
        return true;
    }
}