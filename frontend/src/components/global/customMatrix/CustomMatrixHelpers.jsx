
/** 
 * @param {number} m - m dimension
 * @param {number} n - n dimension
 * @returns {boolean} - Representing valid dimensions 
 */
export function isValidDimensions(m, n){
    // Values aren't integers
    if (!Number.isInteger(m) || !Number.isInteger(n)){
        return false;
    }
    // Dimensions are not in valid range
    else if (m > 10 || m <= 0 || n > 10 || n <= 0){
        return false;
    }
    else{
        return true;
    }
}


/** 
 * @param {number} m - m dimension
 * @param {number} n - n dimension
 * @param {boolean} showAugLine - For showing augmentation line
 * @returns {string} - The proper grid template area  
 */
export function setUpEntriesGridTemplateArea(m, n, showAugLine) {
    // Template Area should look like:
    // Note: augmentation-line will not be present if
    // the matrix is not an augmented one
    // ex. given that parameters m and n represent a 3x3 matrix
    // "entry_0 entry_1 augmentation-line constantEntry_0"
    // "entry_2 entry_3 augmentation-line constantEntry_1"
    // "entry_4 entry_5 augmentation-line constantEntry_2"

    let gridTemplateAreas = [];

    let currEntry = 0;
    let currConstEntry = 0;
    
    // Iterate through both rows and columns
    for (let i = 0; i < m; i++) {
        let currRow = `"`;

        for (let j = 0; j < n; j++) {
            // At the last iteration in row
            if (j == n - 1) {
                // Add to template area
                if(showAugLine){
                    currRow += `augmentation-line constantEntry_${currConstEntry}`
                    currConstEntry++;
                }
                else{
                    currRow += `entry_${currEntry}`
                    currEntry++;
                }
            }
            else {
                // Add to template area
                currRow += `entry_${currEntry} `;
                currEntry++;
            }
        }
        // Push current string row to the array
        currRow += `"`
        gridTemplateAreas.push(currRow);
    }
    
    // Set grid-template-areas css property to the created gridTemplateAreas
    return gridTemplateAreas.join(`\n`);
}


/** 
 * @param {bool} showAugLine - For creating constant entry buttons
 * @param {Array} entryValues - For setting the value of each button
 * @param {function} - For changing entryValues upon user input
 * @returns {Array} - Contains each grid input button  
 */
export function generateEntryButtons(showAugLine, entryValues, setEntryValues){
    
    // Create entries in matrix
    let entryNum = 0;
    let newEntryButtons = entryValues.matrix.flatMap((row, i) => (
        row.map((value, j) => {
            let btn = (
                <input
                    type="text"
                    className="grid-item number-entry"
                    name={`entry_${entryNum}`}
                    id={`entry_${entryNum}`}
                    style={{gridArea: `entry_${entryNum}`}}
                    key={`entry-${entryNum}`}
                    // Set value equal to the one inside of entryValues
                    value={value}
                    // Update entryValues.matrix when the user
                    // enters a value
                    onChange={(e) => {
                        setEntryValues((prevData) =>{
                            const newData = structuredClone(prevData); 
                            newData.matrix[i][j] = e.target.value;
                            return newData;
                    })}}
                />
            )
            entryNum++;
            return btn
        }))
    );

    // Create entries for constant matrix if applicable
    if (showAugLine){
        let constEntryNum = 0;
        let constEntryButtons = entryValues.constMatrix.map((row, i) => {
            let btn = (
                <input
                    type="text"
                    className="grid-item number-entry"
                    name={`constantEntry_${constEntryNum}`}
                    id={`constantEntry_${constEntryNum}`}
                    style={{gridArea: `constantEntry_${constEntryNum}`}}
                    key={`const-entry-${constEntryNum}`}
                    // Set value equal to the one inside of entryValues.constMatrix
                    value={row[0]}
                    // Update entryValues.constMatrix when the user
                    // enters a value 
                    onChange={(e) => {
                                setEntryValues((prevData) => {
                                    const newData = structuredClone(prevData);
                                    newData.constMatrix[i][0] = e.target.value;
                                    return newData;
                            })}}
                /> 
            )
            constEntryNum++;
            return btn
        })
        newEntryButtons = newEntryButtons.concat(constEntryButtons);
    }
    
    return newEntryButtons;

}
