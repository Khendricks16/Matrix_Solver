// Updates the matrix form on webpage to be tailored towards new matrix
// dimensions submitted by user.

function setUpGridTemplateArea(gridContainer, m, n) {
    // Template Area should look like:
    // ex. given that parameters m and n represent a 3x3 matrix
    // "entry_0 entry_1 augmentation-line entry_2"
    // "entry_3 entry_4 augmentation-line entry_5"
    // "entry_6 entry_7 augmentation-line entry_8"

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
                currEntry++;
            }
            else {
                // Add to template area
                currRow += `entry${currEntry} `;
                currEntry++;
            }
        }
        // Push current string row to the array
        currRow += `"`
        gridTemplateAreas.push(currRow);
    }
    
    // Set grid-template-areas css property to the created gridTemplateAreas
    gridContainer.style.gridTemplateAreas = gridTemplateAreas.join(`\n`);
}


function addMatrixEntries(gridContainer, m, n) {
    for (i = 0; i < m * n; i++){
        let newEntry = document.createElement("input");
        newEntry.classList.add("grid-item", "number-entry");
        newEntry.setAttribute("type", "text");
        newEntry.setAttribute("name", `entry_${i}`);
        newEntry.setAttribute("id", `entry_${i}`);
        newEntry.style.gridArea = `entry${i}`;

        gridContainer.appendChild(newEntry);

    }
}


function updateMatrixBrackets(m) {
    const bracketLines = document.getElementsByClassName("vertical-line");
    const bracketLinesArray = Array.prototype.slice.call(bracketLines);

    bracketLinesArray.forEach(function(element){
        element.style.height = `calc(${m} * 30px)`;
    });
}


function addRowLabels(m) {
    // TODO: Add Row labels for all rows next to matrix
    return;
}


function constructMatrix(m, n){
    // CSS grid container for matrix entries
    const gridContainer = document.getElementById("matrix-entries");

    // Remove previous matrix entries
    gridContainer.replaceChildren();

    // Set the number of rows and columns
    document.getElementById("matrix-form").setAttribute('m', m);
    gridContainer.style.gridTemplateRows = `repeat(${m}, auto)`;

    document.getElementById("matrix-form").setAttribute('n', n);
    gridContainer.style.gridTemplateColumns = `repeat(${n + 1}, 1fr)`;

    // Set template area
    setUpGridTemplateArea(gridContainer, m, n);


    // Add HTML entries for matrix
    addMatrixEntries(gridContainer, m, n);
    
    // Add augmentation line when possible
    if (n > 1){
        const augmentationLine = document.createElement("div");
        augmentationLine.classList.add("vertical-line");
        augmentationLine.style.gridArea = "augmentation-line";
        gridContainer.appendChild(augmentationLine);
    }
    
    // Add labels for each row in matrix
    addRowLabels(m);

    // Update matrix brackets size
    updateMatrixBrackets(m);
}



function validateUserDimensions(m, n){
    // Not valid ints
    if (!m || !n){
        return false;
    }
    // Under valid range
    else if (m <= 0 || n <= 1){
        return false;
    }
    // Above valid range
    else if (m > 10 || n > 10){
        return false;
    }
    // Are valid
    else {
        return true;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    dimensionForm = document.getElementById("dimension_form");
    
    dimensionForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Get submitted dimensions
        const formData = new FormData(dimensionForm);

        const m = parseInt(formData.get('m'), 10);
        const n = parseInt(formData.get('n'), 10);

        // Validate dimensions
        validDimensions = validateUserDimensions(m, n);

        if (validDimensions){
            constructMatrix(m, n);
        }
        else {
            alert("Invalid Matrix Dimensions Submitted");
        }
        
        
    })
})