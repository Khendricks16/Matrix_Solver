// Unselects solving method option when clicked
document.addEventListener("DOMContentLoaded", () => {
    // Get all radio buttons

    let lastClicked = null;
    const radioButtons = document.querySelectorAll("input[type=radio]").forEach(function(button) {
        button.addEventListener("click", function() {
            if (lastClicked == button && button.checked){
                // Un-toggle a selected option
                button.checked = false;

                // Remove its URL parameter
                const queryParamas = new URLSearchParams(window.location.search);
                queryParamas.delete("method");
                
                history.pushState(null, null, "?"+queryParamas.toString());

                lastClicked = null;
            }   
            else{
                // Keep track of last button clicked
                lastClicked = button;

                //  Update URL parameter based on option that was selected
                const queryParamas = new URLSearchParams(window.location.search);
                queryParamas.set("method", button.id);

                history.pushState(null, null, "?"+queryParamas.toString());

            }
        })
    })
})