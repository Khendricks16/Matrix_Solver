function setUpTemplateArea(gridContainer, m, n) {
    // Template Area should look like:
    // ex. given that parameters m and n represent a 3x3 matrix
    // "num_0 num_1 augmentation-line num_2"
    // "num_3 num_4 augmentation-line num_5"
    // "num_6 num_7 augmentation-line num_8"

    let gridTemplateAreas = [];

    currEntry = 0;
    
    // Iterate through both rows and columns
    for (i = 0; i < m; i++) {
        currRow = `"`;

        for (j = 0; j < n; j++) {
            // At the last iteration
            if (j == n - 1) {
                // Add to template area
                currRow += `augmentation-line entry${currEntry}`;

                // Add class to specific entry
                document.getElementById(`num_${currEntry}`).style.gridArea = `entry${currEntry}`;

                currEntry++;
            }
            else {
                // Add to template area
                currRow += `entry${currEntry} `;

                // Add class to specific entry
                document.getElementById(`num_${currEntry}`).style.gridArea = `entry${currEntry}`;

                currEntry++;
            }
        }
        // Push current string row to the array
        currRow += `"`
        gridTemplateAreas.push(currRow);
    }
    
    // Set grid-template-areas css property to the created gridTemplateAreas
    gridContainer.style.gridTemplateAreas = gridTemplateAreas.join(`\n`);
    console.log(gridTemplateAreas.join(`\n`));
}


function addAugmentationLine(m, n) {
    // Changes the css grid matrix-values to be tailored towards the
    // given matrix dimensions from the parameters.
 
    // Get the grid container
    const matrixValues = document.getElementById("matrix-values");

    // Set the number of rows and columns
    matrixValues.style.gridTemplateRows = `repeat(${m}, auto)`;
    matrixValues.style.gridTemplateColumns = `repeat(${n + 1}, 1fr)`;

    // Create html element for augmentation line
    const augmentationLine = document.createElement("div");
    augmentationLine.classList.add("vertical-line");
    augmentationLine.style.gridArea = "augmentation-line";
    matrixValues.appendChild(augmentationLine);
    
    // Set up css grid to proper form
    setUpTemplateArea(matrixValues, m, n);
}


function updateMatrixBrackets(m) {
    const bracketLines = document.getElementsByClassName("vertical-line");
    const bracketLinesArray = Array.prototype.slice.call(bracketLines);

    bracketLinesArray.forEach(function(element){
        element.style.height = `calc(${m} * 30px)`;
    });
}


function updateRowLabels(m) {
    return;
}


document.addEventListener("DOMContentLoaded", () => {
    // Get m x n parameters
    const params = new URLSearchParams(window.location.search);
    const m = parseInt(params.get('m'), 10);
    const n = parseInt(params.get('n'), 10);
    
    if (m && n) {
        // Add augmentation line when possible
        if (n > 1){
            addAugmentationLine(m, n);
        }
        
        // Update matrix brackets size
        updateMatrixBrackets(m);

        // Update positioning of row labels
        updateRowLabels(m);
    }
         
})