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

async function retrieveSolvedContent(matrixForm, m, n, method){
    formData = new FormData(matrixForm);
    formData.append('m', m);
    formData.append('n', n);
    formData.append("method", method);

    await fetch("/system-of-equations", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        htmlContent = data.html;
        matricesContent = data.matrices;
    });

    if (htmlContent && matricesContent){
        // Valid entires were submitted as the
        // backend returned what was expected
        return [htmlContent, matricesContent];
    }
    else {
        // Invalid entries were submitted as the backend
        // couldn't solve the matrix
        alert("Error, couldn't solve the matrix");
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
            let [rowOperationButtons, matrices] = await retrieveSolvedContent(matrixForm, m, n, solvingMethod);
            
            const parser = new DOMParser();

            content = parser.parseFromString(content, "text/html");

            // Update row operations HTML content
            const rowOperationsContainer = document.getElementById("row-operations-scroll");
            rowOperationsContainer.innerHTML = rowOperationButtons

            // Give each button the ability to update matrix grid
            // when pressed
            for (let i = 0; i < matrices.length; i++){
                document.getElementById(`row-op-${i}`).addEventListener("click", function (){
                    updateMatrixGrid(matrices[i]);
                })
                
            }
        }
    })
});
