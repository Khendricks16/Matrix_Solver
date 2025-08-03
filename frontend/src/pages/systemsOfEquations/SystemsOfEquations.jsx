import { useContext, useEffect } from "react";

import { SystemsOfEquationsContext } from "./SystemsOfEquationsContext.jsx";

import RowOperationsContent from "../../components/systemsOfEquations/RowOperationsContent.jsx";
import RowOperationsControl from "../../components/systemsOfEquations/RowOperationsControl.jsx";
import CustomMatrix from "../../components/global/customMatrix/CustomMatrix.jsx";

import styles from "./SystemsOfEquations.module.css"

import { submitData } from "./SubmitMatrix.js";

function SystemsOfEquations(){
    
    const {
        solvingMethod, setSolvingMethod,
        setSolvedContent,
        selectedRowOp,
        rowOpButtonRefs,
        selectedRowOpStyle,
        matrixData
    } = useContext(SystemsOfEquationsContext);

    
    // Once the selected Row Operation button has changed, update its style
    useEffect(() => {
        // Ignore if there is no references to any buttons
        if (rowOpButtonRefs.current.length == 0){
            return;
        }
       
        Object.assign(rowOpButtonRefs.current[selectedRowOp.curr].style, selectedRowOpStyle);
        if (selectedRowOp.prev != -1){
            Object.assign(rowOpButtonRefs.current[selectedRowOp.prev].style, {border: "", boxShadow: ""});
        }


    }, [selectedRowOp])

    return(
        <div className={styles["content"]}>
            <section className={styles["solving-methods"]}>
                <h3>Elimination Techniques</h3>
                <hr />
                <form className={styles["solving-methods-form"]}>
                    <label>
                    <input
                        type="radio"
                        name="method"
                        value="gaussian-elimination"
                        checked={solvingMethod == "gaussian-elimination"}
                        onChange={() => setSolvingMethod("gaussian-elimination")}
                    />
                        Gaussian Elimination
                    </label>
                    <label>
                    <input
                        type="radio"
                        name="method"
                        value="gauss-jordan-elimination"
                        checked={solvingMethod == "gauss-jordan-elimination"}
                        onChange={() => setSolvingMethod("gauss-jordan-elimination")}
                    />
                        Gauss-Jordan Elimination
                    </label>
                    <button
                        type="button"
                        onClick={() => setSolvingMethod('')}
                        className={styles["clear-selection-btn"]}
                    >
                        Clear selection
                    </button>
                </form>
            </section>
            <section className={styles["matrix-content"]}>
                <h1 >Enter Dimension for Augmented Matrix:</h1>
                <p>Note: The largest matrix dimension is 10x10.</p>
                <CustomMatrix 
                    isAugmented={true}
                    showRowLabels={true} 
                    ref={matrixData}
                />
                <button
                    onClick={async () => await submitData(matrixData, solvingMethod, setSolvedContent)}
                    >
                    Solve this Matrix
                </button>
            </section>
            <section className={styles["row-operations"]}>
                <h1>Row Operations</h1> 
                <div className={styles["row-operations-scroll"]}>
                    <RowOperationsContent />
                </div>
                <RowOperationsControl />
            </section>
        </div>
    )
}

export default SystemsOfEquations;