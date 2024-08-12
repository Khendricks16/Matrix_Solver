import styles from "./SystemsOfEquations.module.css";

async function fetchSolvedContent(matrixForm, m, n, method){
    // Add all data to a FormData instance
    const formData = new FormData(matrixForm);
    formData.append('m', m);
    formData.append('n', n);
    formData.append("method", method);

    // Hit backend endpoint for solved content
    const response = await fetch("/system-of-equations", {
        method: "POST",
        body: formData
    })

    if (!response.ok){
        // Invalid entries were submitted
        return null;
    }
    
    const data = await response.json()
    const rowOpsContent = data.rowOperationsContent

    return rowOpsContent;
}

export async function submitData(e, matrixStateData, submissionData){
    e.preventDefault();

    // No solving method was selected
    if (!submissionData["solvingMethod"]){
        alert("No solving method has been selected");
        return;
    }
    // Fetch solved data
    let rowOpsContent = await fetchSolvedContent(
                            e.target, 
                            matrixStateData["m"], 
                            matrixStateData["n"],
                            submissionData["solvingMethod"], 
                        );

    if (!rowOpsContent){
        alert("Error, could not solve matrix");
        return;
    }
    else{
        updateRowOperationsContent(
            rowOpsContent,
            submissionData["setRowOperationsContent"],
            matrixStateData["setEntryValues"],
            matrixStateData["setUserDimensions"],
            matrixStateData["m"],
            matrixStateData["n"],
        );
    }
  
}

function updateRowOperationsContent(content, setRowOperationsContent, setEntryValues, setUserDimensions, m, n){
    // Loops through content, and creates buttons for users to
    // click on which will update and display the matrix
    // at each step throughout the row operations in solving.

    // See MatrixActionLogger class documentation to see how 
    // content is defined.
    // Note: All lists and tuples within content are turned into 
    // Javascript arrays when fetched from backend.

    let rowOpText = null;
    const rowOpsButtons = content[0].map((rowOpInfo, rowOpNum) => {
        if (rowOpNum == 0){
            rowOpText = "Starting Matrix";
        }
        else if (rowOpInfo[0] == "swap_rows"){
            rowOpText = <>
               R<sub>{rowOpInfo[1]}</sub> &larr;&rarr; R<sub>{rowOpInfo[2]}</sub> 
            </>;
        }
        else if (rowOpInfo[0] == "multiply_row"){
            // The constant is a fraction
            if (rowOpInfo[2].indexOf("/") != -1){
                let [numerator, denominator] = rowOpInfo[2].split("/");
                let fraction = <>
                    <sup>{numerator}</sup>&frasl;<sub>{denominator}</sub>
                </>;
                rowOpText = <>
                    {fraction}R<sub>{rowOpInfo[1]}</sub> &rarr; R<sub>{rowOpInfo[1]}</sub>
                </>;
            }
            // The constant is a whole number
            else{
                rowOpText = <>
                    {rowOpInfo[2]}R<sub>{rowOpInfo[1]}</sub> &rarr; R<sub>{rowOpInfo[1]}</sub>
                </>
                
            }
        }
        else if (rowOpInfo[0] == "row_multiple_to_row"){
            // The constant is a fraction
            if (rowOpInfo[2].indexOf("/") != -1){
                let [numerator, denominator] = rowOpInfo[2].split("/");
                let fraction = <>
                    <sup>{numerator}</sup>&frasl;<sub>{denominator}</sub>
                </>;

                rowOpText = <>
                    R<sub>{rowOpInfo[1]}</sub> + {fraction}R<sub>{rowOpInfo[3]}</sub> &rarr; R<sub>{rowOpInfo[1]}</sub>
                </>;
            }
            // The constant is a whole number
            else {
                rowOpText = <>
                    R<sub>{rowOpInfo[1]}</sub> + {rowOpInfo[2]}R<sub>{rowOpInfo[3]}</sub> &rarr; R<sub>{rowOpInfo[1]}</sub>
                </>
            }
        }
        return (
            <button
                    id={`row-op-${rowOpNum}`}
                    key={`row-op-${rowOpNum}`}
                    className={styles["row-op-btn"]}
                    onClick={() => {
                        setUserDimensions({m: m, n: n, resetEntriesOnChange: false});
                        setEntryValues(() => {
                            return {matrix: content[1][rowOpNum], constMatrix: content[2][rowOpNum]};
                        });
                    }}
            >
                {rowOpText}
            </button>
        )
    })

    setRowOperationsContent(rowOpsButtons);
} 