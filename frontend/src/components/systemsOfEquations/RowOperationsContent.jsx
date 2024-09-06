import { useContext, useEffect, useRef } from "react";

import { SystemsOfEquationsContext } from "../../pages/systemsOfEquations/SystemsOfEquationsContext.jsx"
import styles from "../../pages/systemsOfEquations/SystemsOfEquations.module.css"

import PropTypes from "prop-types";

function getRowOpDescription(rowOpNum, rowOpInfo){
    // Creates text for row operation button, which describes the step that took place
    let rowOpText = null;

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

    return rowOpText;
}

function RowOperationsContent(){
    // Loops through solvedContent, and creates buttons for users to
    // click on which will update and display the matrix
    // at each row operation step throughout the solving method.

    // See MatrixActionLogger class documentation to see how 
    // solvedContent is defined.
    // Note: All lists and tuples within solvedContent as defined in Python
    // are turned into Javascript arrays when fetched from backend.
    
    // Array of buttons which the component will render
    const rowOpsButtons = useRef();

    // Get state for SystemsOfEquations page
    const {
        setSelectedRowOp, selectedRowOpStyle,
        rowOpButtonRefs,
        solvedContent,
        matrixData,

    } = useContext(SystemsOfEquationsContext);



    // Logic for handling a click on a row operation button
    const handleClick = (rowOpNum) => {
        setSelectedRowOp((prevData) => ({curr: rowOpNum, prev: prevData.curr, last: prevData.last}));
        
        // Get dimensions for matrix through solved content
        let m = null;
        let n = null;
        try {
            m = solvedContent[1][0].length;
            n = solvedContent[1][0][0].length + 1;

            if (m === undefined || n === undefined){
                throw new Error("Unable to display step")
            }
        } catch (error) {
            alert(error.message);
            return;
        }

        matrixData.current.updateUserDimensions({m: m, n: n, resetEntriesOnChange: false});
        matrixData.current.updateEntryValues({
            matrix: solvedContent[1][rowOpNum],
            constMatrix: solvedContent[2][rowOpNum]
        })
    };

    

    useEffect(() => {
        // Update and account for where the last index is in selectedRowOp 
        setSelectedRowOp((prevData) => ({...prevData, last: solvedContent[0].length - 1}))

        // If there has been no solved content yet, then don't show anything
        if (JSON.stringify(solvedContent) == "[[],[],[]]"){
            return;
        }

        // Redefine rowOpsButtons
        rowOpsButtons.current = solvedContent[0].map((rowOpInfo, rowOpNum) => {
            
            let rowOpDescription = getRowOpDescription(rowOpNum, rowOpInfo)
            
            // Add button to rowOpButtons
            return (
                <button
                        id={`row-op-${rowOpNum}`}
                        key={`row-op-${rowOpNum}`}
                        ref={(el) => (rowOpButtonRefs.current[rowOpNum] = el)}
                        // Set the default selected button to the starting
                        // matrix
                        style={rowOpNum == 0 ? selectedRowOpStyle : {border: "", boxShadow: ""}}
                        className={styles["row-op-btn"]}
                        onClick={() => handleClick(rowOpNum)}
                >
                    {rowOpDescription}
                </button>
            )
        })

    }, [solvedContent])


    // Component will display all generated buttons
    return rowOpsButtons.current;
} 

RowOperationsContent.propTypes = {
    solvedContent: PropTypes.array,
    setEntryValues: PropTypes.func,
    setUserDimensions: PropTypes.func,
    m: PropTypes.number,
    n: PropTypes.number,

}

export default RowOperationsContent;