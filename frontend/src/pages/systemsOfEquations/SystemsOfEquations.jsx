import { useState } from "react";

import { submitData } from "./SystemsOfEquationsHelpers.jsx"
import CustomMatrix from "../../components/customMatrix/CustomMatrix.jsx";

import styles from "./SystemsOfEquations.module.css"


function SystemsOfEquations(){
    // State management for page: 
    // - solvingMethod: Handles the selection logic for radio buttons
    // - rowOperationsContent: Content to display row operation steps
    //      in solving process
    
    const [solvingMethod, setSolvingMethod] = useState('');
    const [rowOperationsContent, setRowOperationsContent] = useState([]);

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
                    onSubmission={submitData} 
                    {...{solvingMethod, setRowOperationsContent}}
                />
            </section>
            <section className={styles["row-operations"]}>
                <h1>Row Operations</h1> 
                <div className={styles["row-operations-scroll"]}>
                    {rowOperationsContent}
                </div>
            </section>
        </div>
    )
}

export default SystemsOfEquations;