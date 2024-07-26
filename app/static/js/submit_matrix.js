// Submits and fetches data to add to DOM, once the matrix
// form is submitted by the user

function getSolvingMethod(){
    selectedMethod = null;

    document.querySelectorAll("input[type=radio]").forEach(function(button) {
        if (button.checked){
            selectedMethod = button.id;
        }
    })

    return selectedMethod;
}

async function fetchSolvedContent(matrixForm, m, n, method){
    formData = new FormData(matrixForm);
    formData.append('m', m);
    formData.append('n', n);
    formData.append("method", method);

    const response = await fetch("/system-of-equations", {
        method: "POST",
        body: formData
    })

    if (!response.ok){
        // Invalid entries were submitted
        return [null, null, null];
    }
    
    data = await response.json()
    rowOpContent = data.rowOperationsHTML
    coefficientMatricesContent = data.coefficientMatrices
    constantMatricesContent = data.constantMatrices


    if (rowOpContent && coefficientMatricesContent && constantMatricesContent){
        // Valid entires were submitted as the
        // backend returned what was expected
        return [rowOpContent, coefficientMatricesContent, constantMatricesContent];
    }
    else {  
        // Invalid entries were submitted as the backend
        // couldn't solve the matrix
        return [null, null, null];
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Get the form
    const matrixForm = document.getElementById("matrix-form");

    matrixForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        // Get dimensions of matrix
        m = matrixForm.getAttribute('m');
        n = matrixForm.getAttribute('n');

        // Get selected solving method
        solvingMethod = getSolvingMethod();

        // Prevent submission if no solving method was selected
        if (!solvingMethod){
            event.preventDefault();
            alert("No solving method has been selected");

        }
        else {
            // Fetch solved data
            let [
                rowOperationButtons, 
                coefficientMatrices, 
                constantMatrices
            ] = await fetchSolvedContent(
                matrixForm, 
                m, 
                n, 
                solvingMethod
            );

            if (!rowOperationButtons || !coefficientMatrices || !constantMatrices){
                alert("Error, could not solve matrix");
                return;
            }

        
            const parser = new DOMParser();

            content = parser.parseFromString(content, "text/html");

            // Update row operations HTML content
            const rowOperationsContainer = document.getElementById("row-operations-scroll");
            rowOperationsContainer.innerHTML = rowOperationButtons

            // Give each button the ability to update matrix grid
            // when pressed
            for (let i = 0; i < coefficientMatrices.length; i++){
                document.getElementById(`row-op-${i}`).addEventListener("click", function (){
                    updateMatrixValues(coefficientMatrices[i], constantMatrices[i]);
                })
                
            }
        }
    })
});
