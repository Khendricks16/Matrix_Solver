import { useState, useEffect } from "react";
import PropTypes from "prop-types"

import { isValidDimensions, setUpEntriesGridTemplateArea, generateEntryButtons} from "./CustomMatrixHelpers.jsx"

import styles from "./CustomMatrix.module.css";


/**
 * Returns two things:
 *  1 - A <div> for updating dimensions of the matrix
 *  2 - The matrix itself in the form of a <form>
 *
 *  Stylization of how these elements are arranged along
 *  with any other elements being showcased around
 *  the matrix must be done on corresponding page
 *  itself.
 */
function CustomMatrix({ isAugmented, onSubmission, ...submissionData }){
    // State management for component: 
    // - userDimensions: The dimensions typed by user.
    // - dimensions: The validated dimensions used for matrix.
    // - showAugLine: A boolean for adding extra content if the
    //      matrix is an augmented one.
    // - entryValues: An object containing the arrays of values for
    //      each entry in the matrix.
    // - entryButtons: An array to contain each of the buttons for
    //      entries in the matrix.


    const [userDimensions, setUserDimensions] = useState({ m: 0, n: 0});
    const [dimensions, setDimensions] = useState({ m: 1, n: 1});
    
    const [showAugLine, setShowAugLine] = useState(false);

    const [entryValues, setEntryValues] = useState({matrix: [], constMatrix: []});
    const [entryButtons, setEntryButtons] = useState([]);


    // Handle input for matrix dimensions from user
    const handleChange = (e) => {
        // Keep any changes stored in state
        setUserDimensions(prevDimension => (
                {...prevDimension, [e.target.name]: Number(e.target.value)}
            ))
    }

    // When userDimensions change:
    //  - Set dimensions
    useEffect(() => {
        if (isValidDimensions(userDimensions['m'], userDimensions['n'])){
            // Validated userDimensions
            setDimensions(userDimensions);
        }
        else {
            // Set up Matrix to display the "Invalid Dimensions" in
            // a nice format
            setDimensions({m: 1, n: 1});
        }
    }, [userDimensions])


    // When dimensions change:
    //  - Set showAugLine 
    //  - Set all entry values for matrix to nothing
    useEffect(() => {
        const matrix = [];
        const constMatrix = [];
        
        if (isAugmented && dimensions['n'] > 1){
            setShowAugLine(true);

            for(let i = 0; i < dimensions['m']; i++){
                matrix.push(new Array(dimensions['n'] - 1).fill(""))
                constMatrix.push(new Array(1).fill(""))
            }
        }
        else{
            setShowAugLine(false);

            for(let i = 0; i < dimensions['m']; i++){
                matrix.push(new Array(dimensions['n']).fill(""));
            }
        }

        setEntryValues({
            matrix: matrix,
            constMatrix: constMatrix
        })
        
    }, [dimensions, isAugmented])

    
    // When dimensions or entryValues change
    //  - Create and set new entry buttons
    useEffect(() => {
        setEntryButtons(generateEntryButtons(showAugLine, entryValues, setEntryValues))
    }, [entryValues, dimensions, showAugLine])



    // Dynamic CSS based on dimensions
    const matrixEntriesStyle = {
        gridTemplateRows: `repeat(${dimensions['m']}, auto)`,
        gridTemplateColumns: `repeat(${dimensions['n']}, 1fr)`,
        gridTemplateAreas: setUpEntriesGridTemplateArea(dimensions['m'], dimensions['n'], showAugLine),
    };


    let verticalLineHeight = {
        height: `calc(${dimensions['m']} * 30px)`
    }

    // Default vertical line height
    if (dimensions['m'] == 0 || dimensions['n'] == 0){
        verticalLineHeight = {
            height: "80px"
        }
    }

    return (
        <>
        {/* Customize Dimensions*/} 
        <div className={styles["dimension-form"]}>
            <label htmlFor="m-btn">m: (rows)</label>
            <input 
                type="number"
                name="m"
                onChange={handleChange}
                min="0"
                max="10"
                className="dimension-entry"
                id="m-btn"
            />
            <label htmlFor="n-btn">n: (columns)</label>
            <input 
                type="number"
                name="n"
                onChange={handleChange}
                min="0"
                max="10"
                className="dimension-entry"
                id="n-btn" 
            />
        </div>
       
        {/* Matrix form*/}
        <form 
            onSubmit={async (e) => await onSubmission(e, setEntryValues, {...submissionData, ...dimensions})} 
            className={styles["matrix-form"]}   
        >
            <div className={styles["left-matrix-bracket"]}>
                <div className={styles["horizontal-line"]} />
                <div className={styles["vertical-line"]} style={verticalLineHeight}/>
                <div className={styles["horizontal-line"]} />
            </div>
            <div className={styles["matrix-entries"]} style={matrixEntriesStyle}>
                
                {isValidDimensions(userDimensions['m'], userDimensions['n']) ? entryButtons : (
                    <p>Invalid dimensions</p>
                )}

                {showAugLine ? (
                    <div 
                        className={styles["vertical-line"]} 
                        style={{...verticalLineHeight, gridArea: `augmentation-line`}}
                    />) : null}
            </div>
            <div className={styles["right-matrix-bracket"]}>
                <div className={styles["horizontal-line"]} />
                <div className={styles["vertical-line"]} style={verticalLineHeight}/>
                <div className={styles["horizontal-line"]} />
            </div>
            <input className={styles["matrix-values-submit"]} type="submit" value="Solve This Matrix" />
        </form>
        </>
    )
}

CustomMatrix.propTypes = {
    onSubmission: PropTypes.func,
    isAugmented: PropTypes.bool,
    submissionData: PropTypes.object,
}


export default CustomMatrix;