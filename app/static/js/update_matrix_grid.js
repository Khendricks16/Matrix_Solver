function updateMatrixGrid(matrix){
    let currEntry = 0;
    for (i = 0; i < matrix.length; i++){
        for (j = 0; j < matrix[i].length; j++){
            let entry = document.getElementById(`entry_${currEntry}`);
            entry.value = matrix[i][j];
            currEntry++;
        }
    }
    return;
    }
