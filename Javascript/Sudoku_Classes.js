console.log("loaded objects");

// This class represents 1 of the 81 segments of the 9x9 sudoku grid
class SudokuSegment {
    constructor(value, posX, posY, quadrant) {
    this.value = value;
    this.posX = posX;
    this.posY = posY;
    this.index = 0;
    this.quadrant = quadrant;
    this.possibleValues = [];
    }

    setValue(value) {
        this.value = value;
    }

    setIndex(index) {
        this.index = index;
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

    setPossibilities(dimension) {
        for (let i = 1; i <= dimension; i++) {
            this.possibleValues.push(i);
        }
    }

    getNumPossibilities() {
        return this.possibleValues.length;
    }

    removePossibility(value) {
        for(let i = this.possibleValues.length; i--;) {
            if(this.possibleValues[i] === value) {
                this.possibleValues.splice[i, value];
            }
        }
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
            segment.setPossibilities(dimension);
            segment.setIndex(this.convertCoordToIndex(segment.posX, segment.posY));
            this.gridArr.push(segment);
        }    
        this.sortGrid();
    }

    evaluateQuadrant(xVal, yVal) {
        // Y offest is a way to determine what quadrant with math instead of nested conditionals
        // By taking the ceil of y divided by dimension we can tell what fraction of the grid the coordinates fall in
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

    // For all of the checkers we only need to get every segment we want to check into an array and pass it to
    // the arrayToCheck function 
    checkColumnComplete(column) {
        //Iterate through every coordinate set with x = column and y = 0-array dimension
        var arrayToPass = [];
        for(let i = 1; i <= this.gridDimension; i++) {
            arrayToPass.push(this.gridArr(this.convertCoordToIndex(column, i)).value);
        }
        return this.arrayToCheck(arrayToPass);
    }

    // This is the easiest part to check, as the array is organized in a way to facilitate this
    checkRowComplete(row) {
        // All that needs to be done math wise is find the beginning index and end index of the row
        // Which can be done using the convertCoordToIndex function, and feeding it an x of 1 and dimension with y set to column
        let start = this.convertCoordToIndex(1, row);
        let end = this.convertCoordToIndex(this.gridDimension, row);
        var arrayToPass = [];
        for(let i = start ;i <= end; i++) {
            arrayToPass.push(this.gridArr[i].value);
        }
        return this.arrayToCheck(arrayToPass);
    }

    // Find out which fraciton of root dimension the quadrant is in
    // i.e quadrant 1,2,3 fall within 0-sqrt(9), 4,5,6 fall within sqrt(9)-2sqrt(9), 7,8,9 fall within 2sqrt(9)-9
    // this should be scalable for any of the root dimensions
    checkQuadrantComplete(quadrant) {
        // This is going to keep track of which fraction of the dimension the quadrant is in
        let quadCheckerY = 0;
        let quadCheckerX = quadrant;
        var arrayToPass = [];
        // this finds the fraction of the grid the quadrant is in in terms of the y dimension
        for(let i = 0; i <= this.dimensionRoot; i++) {
            if(quadrant > i*this.dimensionRoot && quadrant <= (i+1)*this.dimensionRoot) {
                quadCheckerY = i;
            }
        }
        // if the quadrant number is larger than the root we can reduce the quadrant by the root
        // until it falls in the bounds of > 0 and <= root. this way we can evaluate all quadrants with
        // the same math.
        while(quadCheckerX > this.dimensionRoot) {
            quadCheckerX -= this.dimensionRoot;
        }
        // We adjust the value by -1 to make it work with the index at 0
        quadCheckerX--;
        // finally we need to add every coordinate set to the array to check
        for(let i = 1; i <= this.dimensionRoot; i++ ) {
            for( let k = 1; k <= this.dimensionRoot; k++) {
                arrayToPass.push(this.gridArr[this.convertCoordToIndex((this.dimensionRoot*quadCheckerX) + i, (this.dimensionRoot*quadCheckerY) + k)].value);
            }
        }
        return this.arrayToCheck(arrayToPass);
    }

    // This function will check an array to see if it contains exactly one occurence of the numbers 1-9
    // without needing to duplicate code in each function
    // We will have an array of empty booleans, and flip them on first occurence of each number.
    // should the number appear again we will break the loop and return an error
    arrayToCheck(array) {
        // Array needs to be populated with dimension number of booleans
        let checkerArray = [this.gridDimension];
        // Initializes array for checking
        for(let i = 0; i < this.gridDimension; i++) {
            checkerArray[i] = false
        }
        // I imagine this is bad practice however i cannot think of a better way offhand to improve it  
        // The idea is if it is able to iterate through this entire list without any duplicate showing then it follows the rules     
        for(let i = 0; i < array.length; i++) {
            let numberToCheck = array[i];
            if(!checkerArray[numberToCheck-1]) {
                checkerArray[numberToCheck-1] = true;
            }
            else {
                // -1 is the error code saying there is a duplicate somewhere in the array
                return false;
            }
        }
        return true;
    }

    // This will print a grid representaiton of the array to the console
    printArray() {
        let str = '|';
        let spacer = '';
        let spacerDimension = 3*this.gridDimension + this.dimensionRoot+1;
        for (let i = 0; i < spacerDimension; i++) {
            spacer += '-'
        }
        // For loop starts at one for modulus to work
        for(let i = 1; i <= this.gridArr.length; i++) {
            // i-1 offsets the foor loop to grab the proper value from the array since array index starts at 0
            // This code doesnt need to be pretty, this is only a text representation of the grid for test purposes
            str += " " + this.gridArr[i-1].value + " ";
            if(i % this.dimensionRoot == 0) {
                str += "|";
            }
            if(i % this.gridDimension == 0){
                str += '\n';
                if((i % (this.dimensionRoot*this.gridDimension) == 0) && (i != this.gridArr.length)){
                    str += spacer;
                    str += "\n";
                }
                if(i != this.gridDimension**2) {
                    str += '|';
                }               
            }           
        }
        console.log(str);
    }

    // From here on down will be every function that "solves" the grid
    // The solver will be integrated into the grid to make sure whenever we have a grid we can also solve it
    // Hopefully this will make things easier when it come to implementing this in html

    // The sorting algorith is going to go like this:
    // Start by calculating what numbers can go where
    // rank each segment by the number of options that can go in each segment
    // segments with fewer options have priority over segments with more
    // If there is a tie, we will resort to a random choice
    sortGrid() {
        // Get the index of the segment with the least possible options
        let indexToSet = this.getLeastOptionSegment();
        let valueToSet = this.chooseValueToSet(indexToSet);
        this.setIndexValue(indexToSet, valueToSet);

    }

    //This function will return the index number of the segment with the least possible choices, 
    // or in the case of a tie a random segment with the least possible choices
    getLeastOptionSegment() {
        let indexArray = [];
        let checkerValue = this.gridDimension;
        for (let i = 0; i < this.gridDimension**2; i++) {
            if(this.gridArr[i].getNumPossibilities() == checkerValue) {
                indexArray.push(i);
            }
            else if(this.gridArr[i].getNumPossibilities() < checkerValue) {
                indexArray = [];
                indexArray.push(i);
                checkerValue = this.gridArr[i].getNumPossibilities;
            }
        }
        if(indexArray.length > 1) {
            return this.gridArr[indexArray[Math.floor(Math.random()*indexArray.length)]].index;
        }
        else {
            return this.gridArr[indexArray[0]].index;
        }
    }

    // This function will pull a number from the possible values of a segment
    chooseValueToSet(index) {
        return this.gridArr[index].possibleValues[Math.floor(Math.random()*this.gridArr[index].possibleValues.length)];
    }

    // Will remove the assigned value from the column, row and quadrant
    modifyPossibleValues(index, value) {
        columnToModify = this.gridArr[index].posY;
        rowToModify = this.gridArr[index].posX;
        // We will start by finding the index of every segment that needs to be modified
        // then use the splice function to remove the value from the list of possible values
        this.getCoordValue

    }
}