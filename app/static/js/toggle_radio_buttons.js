// Adds toggling feature to all radio buttons representing solving methods
// Along with updates to URL parameters upon selection

document.addEventListener("DOMContentLoaded", () => {
    // Used for keeping track of the radio button that was 
    // last clicked 
    let lastClicked = null;
    
    const radioButtons = document.querySelectorAll("input[type=radio]").forEach(function(button) {
        button.addEventListener("click", function() {
            if (lastClicked == button && button.checked){
                // Un-toggle a selected option
                button.checked = false;

                lastClicked = null;
            }   
            else{
                // Keep track of last button clicked
                lastClicked = button;
            }
        })
    })
})