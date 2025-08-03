import { useContext } from "react";

import { SystemsOfEquationsContext } from "../../pages/systemsOfEquations/SystemsOfEquationsContext.jsx"

function RowOperationsControl(){
    // Get state for SystemsOfEquations page
    const {
        selectedRowOp,
        rowOpButtonRefs,
        solvedContent,

    } = useContext(SystemsOfEquationsContext);

    return (
    <div>
        {/* If solved content is not empty, then display 
        Next and Previous buttons for row operations steps */}
        {JSON.stringify(solvedContent) != "[[],[],[]]" ? (
            <>
                <button 
                    onClick={() => {
                        // selectedRowOp is Starting Matrix
                        if (selectedRowOp.curr - 1 < 0){
                            return;
                        }
                        rowOpButtonRefs.current[selectedRowOp.curr - 1].click();
                    }}
                    className="control-button">
                        Previous
                </button>
                <button 
                    onClick={() => {
                        // selectedRowOp is Ending Matrix
                        if (selectedRowOp.curr != selectedRowOp.last){
                            rowOpButtonRefs.current[selectedRowOp.curr + 1].click();
                        }
                        
                    }}
                    className="control-button">
                        Next
                </button>
            </>   
        ) : null}
    </div>
    )
    
}

export default RowOperationsControl;