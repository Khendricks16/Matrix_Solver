function updateMatrixValues(matrix, constantMatrix = null){
    // Update matrix entry values
    let currEntry = 0;
    for (let i = 0; i < matrix.length; i++){
        for (let j = 0; j < matrix[i].length; j++){
            let entry = document.getElementById(`entry_${currEntry}`);
            entry.value = matrix[i][j];
            currEntry++;
        }
    }

    // Update entry values for constant matrix if
    // applicable
    currEntry = 0;
    for (let i = 0; i < constantMatrix.length; i++){
        let entry = document.getElementById(`constantEntry_${currEntry}`);
        entry.value = constantMatrix[i][0];
        currEntry++;

    }
}
