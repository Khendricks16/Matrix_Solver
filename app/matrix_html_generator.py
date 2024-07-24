import inspect
from copy import deepcopy

class MatrixActionLogger():
    def __init__(self, matrix):
        """
        Args:
            data (list): The list representation of the matrix
        """
        # Reference to the Matrix.data in order to keep track of what
        # the matrix is currently equal too.
        self.curr_matrix = matrix

        # List to track row operations performed on the matrix.
        # Each entry:
        # - tuple[0]: A copy of the matrix at that point in time.
        # - tuple[1]: The row operation performed to obtain the matrix in tuple[0].
        # Initialize with the starting matrix.
        starting_matrix = f"""
            <button id="row-op-0" class="row-op-btn">
            Starting Matrix  
            </button>
            """
        self.row_op_content = [(self.stringify_matrix_entries(), starting_matrix)]
    

    def stringify_matrix_entries(self) -> list:
        """
        Returns a deep copy of self.curr_matrix which each entry a str.
        """

        matrix_cpy = deepcopy(self.curr_matrix)

        for i, row in enumerate(matrix_cpy):
            for j, entry in enumerate(row):
                matrix_cpy[i][j] = str(matrix_cpy[i][j])
        
        return matrix_cpy


    def record_elementary_row_op(self, *args) -> None:
        # Get the name of function that called
        # this method
        caller_function = inspect.stack()[1].function

        # Generate HTML for row operation
        html_content = f"""
            <button id="row-op-{len(self.row_op_content)}" class="row-op-btn">
            """
        
        if caller_function == "swap_rows":
            row_op_label = f"R<sub>{args[0] + 1}</sub> &larr;&rarr; R<sub>{args[1] + 1}</sub>"
        elif caller_function == "multiply_row":
            # The constant is a fraction
            if str(args[1]).find("/") != -1:
                fraction = f"<sup>{args[1].numerator}</sup>&frasl;<sub>{args[1].denominator}</sub>"
                row_op_label = f"{fraction}R<sub>{args[0] + 1}</sub> &rarr; R<sub>{args[0] + 1}</sub>"
            # The constant is a whole number
            else:
                row_op_label = f"{str(args[1])}R<sub>{args[0] + 1}</sub> &rarr; R<sub>{args[0] + 1}</sub>"
        elif caller_function == "row_multiple_to_row":
            # The constant is a fraction
            if str(args[1]).find("/") != -1:
                fraction = f"<sup>{args[1].numerator}</sup>&frasl;<sub>{args[1].denominator}</sub>"
                row_op_label = f"R<sub>{args[0] + 1}</sub> + {fraction}R<sub>{args[2] + 1}</sub> &rarr; R<sub>{args[0] + 1}</sub>"                
            # The constant is a whole number
            else:
                row_op_label = f"R<sub>{args[0] + 1}</sub> + {str(args[1])}R<sub>{args[2] + 1}</sub> &rarr; R<sub>{args[0] + 1}</sub>"
        else:
            # Not a valid row operation method called this function
            return

        # A valid row operation method called this function
        html_content += f"\n{row_op_label}" + "\n</button>"
        self.row_op_content.append((self.stringify_matrix_entries(), html_content))