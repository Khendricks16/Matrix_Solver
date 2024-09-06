import { useState, useEffect, forwardRef, useImperativeHandle} from "react";
import PropTypes from "prop-types"

import { isValidDimensions, setUpEntriesGridTemplateArea, generateEntryButtons} from "./CustomMatrixHelpers.jsx"

import styles from "./CustomMatrix.module.css";

/** 
 * @param {bool} isAugmented -  ...
 * @param {bool} showRowLabels - ...
 * @param {function} updateStateRef -  
 *
 * Returns two things:
 *  1 - A <div> for updating dimensions of the matrix
 *  2 - The matrix itself in the form of a <form>
 *
 *  Stylization of how these elements are arranged along
 *  with any other elements being showcased around
 *  the matrix must be done on corresponding page
 *  itself.
 **/
const CustomMatrix = forwardRef(({ isAugmented = false, showRowLabels = false}, ref) => {
    // State management for component: 
    // - userDimensions: The dimensions typed by user.
    // - dimensions: The validated dimensions used for matrix.
    // - showAugLine: A boolean for adding extra content if the
    //      matrix is an augmented one.
    // - entryValues: An object containing the arrays of values for
    //      each entry in the matrix.
    // - entryButtons: An array to contain each of the buttons for
    //      entries in the matrix.


    const [userDimensions, setUserDimensions] = useState({ m: 0, n: 0, resetEntriesOnChange: true});
    const [dimensions, setDimensions] = useState({ m: 1, n: 1, resetEntriesOnChange: true});
    
    const [showAugLine, setShowAugLine] = useState(false);

    const [entryValues, setEntryValues] = useState({matrix: [[]], constMatrix: [[]]});
    const [entryButtons, setEntryButtons] = useState([]);


    // Handle input for matrix dimensions from user
    const handleChange = (e) => {
        // Keep any changes stored in state
        const newValue = e.target.value ? Number(e.target.value) : ""
        setUserDimensions(prevOtherDimension => (
                {...prevOtherDimension, [e.target.name]: newValue, resetEntriesOnChange: true}
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
    //  - Set all entry values for matrix to nothing if desired
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

        if (dimensions["resetEntriesOnChange"]){
            setEntryValues({matrix: matrix, constMatrix: constMatrix});
        }

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
        height: `calc(${dimensions['m']} * 35px)`
    }

    // Default vertical line height
    if (dimensions['m'] == 0 || dimensions['n'] == 0){
        verticalLineHeight = {
            height: "80px"
        }
    }

    useImperativeHandle(ref, () => ({
        getDimensions: () => dimensions,
        getEntryValues: () => entryValues,
        updateEntryValues: (data) => setEntryValues(data),
        updateUserDimensions: (data) => setUserDimensions(data)
    }))

    return (
        <>
        {/* Customize Dimensions*/} 
        <div className={styles["dimension-form"]}>
            <label htmlFor="m-btn">m: (rows)</label>
            <input 
                type="number"
                name="m"
                value={userDimensions["m"]}
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
                value={userDimensions["n"]}
                onChange={handleChange}
                min="0"
                max="10"
                className="dimension-entry"
                id="n-btn" 
            />
        </div>
       
        {/* Matrix form*/}
        <form className={styles["matrix-form"]}>
            <div className={styles["row-labels"]}>
            {showRowLabels && isValidDimensions(userDimensions['m'], userDimensions['n']) ? (
                entryValues.matrix.map((_, rowNum) => {
                    return <label key={rowNum}>R<sub>{rowNum + 1}</sub></label>;
                })
            ): null}
                
                
            </div>
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
            <div style={{gridArea: "matrix-btns"}}>
                <button 
                    className={styles["control-button"]} 
                    type="button" 
                    onClick={() => {
                    setUserDimensions({m: 0, n: 0});
                }}
                >
                    Clear Matrix
                </button>
                <button 
                    className={styles["control-button"]} 
                    type="button" 
                    onClick={() => {
                    setDimensions({m: dimensions["m"], n: dimensions["n"], resetEntriesOnChange: true});
                }}
                >
                    Clear Entries
                </button>
            </div>
            
        </form>
        </>
    )
});

CustomMatrix.propTypes = {
    isAugmented: PropTypes.bool,
    showRowLabels: PropTypes.bool,
}

CustomMatrix.displayName = "CustomMatrix";


export default CustomMatrix;