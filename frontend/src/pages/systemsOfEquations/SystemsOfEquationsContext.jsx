import { createContext, useState, useRef } from "react";

import PropTypes from "prop-types";

export const SystemsOfEquationsContext = createContext(null);

export const SystemsOfEquationsProvider = ({ children }) =>  {
    // State management for page: 
    // - solvingMethod: Handles the selection logic for radio buttons
    // - rowOperationsContent: Content to display row operation steps
    //      in solving process
    
    const [solvingMethod, setSolvingMethod] = useState('');
    const [solvedContent, setSolvedContent] = useState([[], [], []]);
    
    // Selection of row operation buttons
    const rowOpButtonRefs = useRef([]);
    const [selectedRowOp, setSelectedRowOp] = useState({curr: 0, prev: -1, last: 0});
    const selectedRowOpStyle = {border: "2px solid #0056b3", boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)"};

    
    // Matrix for systems of equations
    const matrixData = useRef();

    return (
        <SystemsOfEquationsContext.Provider
            value={{
                solvingMethod, setSolvingMethod,
                solvedContent, setSolvedContent,
                rowOpButtonRefs,
                selectedRowOp, setSelectedRowOp,
                selectedRowOpStyle,
                matrixData
            }}
        >
            {children}
        </SystemsOfEquationsContext.Provider>
            
    );
};

SystemsOfEquationsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
