export async function submitData(matrixData, solvingMethod, setSolvedContent){
    const entryValues = matrixData.current.getEntryValues();
    const dimensions = matrixData.current.getDimensions();
    
    // No solving method was selected
    if (!solvingMethod){
        alert("No solving method has been selected");
        return;
    }

    // Check if one or more entries are empty

    
    // Create payload to send to backend
    const data = {
        matrix: entryValues["matrix"],
        constMatrix: entryValues["constMatrix"],
        m: dimensions["m"],
        n: dimensions["n"],
        method: solvingMethod,
    }


    // Hit backend endpoint for solved content
    const response = await fetch("/system-of-equations", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',  // Indicates that the data is JSON
          },        
        body: JSON.stringify(data)
    })

    if (!response.ok){
        // Invalid entries were submitted
        return null;
    }
    
    const fetchedData = await response.json()
    const solvedContent = fetchedData.rowOperationsContent

    if (!solvedContent){
        alert("Error, could not solve matrix");
        return;
    }
    else{
        setSolvedContent(solvedContent);
    }
  
}