// Updates the action within the HTML matrix form
// before submission to include the dimensions and 
// solving method within the post request

function getSolvingMethod(){
    selectedMethod = null;

    document.querySelectorAll("input[type=radio]").forEach(function(button) {
        if (button.checked){
            selectedMethod = button.id;
        }
    })

    return selectedMethod;
}


document.addEventListener('DOMContentLoaded', function () {
    // Get the form
    const matrixForm = document.getElementById("matrix-form");

    matrixForm.addEventListener("submit", function(event) {
        // Get dimensions of matrix
        m = matrixForm.getAttribute('m');
        n = matrixForm.getAttribute('n');

        // Get selected solving method
        solvingMethod = getSolvingMethod()

        // Prevent submission if no solving method was selected
        if (!solvingMethod){
            event.preventDefault();
            alert("No solving method has been selected");
        }
        else {
            // Update the form action URL just before submission
            params = `m=${m}&n=${n}&method=${solvingMethod}`
            matrixForm.action = `${matrixForm.action.split('?')[0]}?${params}`;
        }
    })
});
