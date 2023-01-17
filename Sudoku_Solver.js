console.log("loaded solver");

var segment = new SudokuGrid(9);
//segment.printGrid();
//for(let i = 1; i < 81; i++) {
//    console.log(segment.getIndexValue(i));
//}

segment.setCoordValue(2,2,9);
segment.printGrid();