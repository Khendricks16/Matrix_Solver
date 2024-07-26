import inspect
from copy import deepcopy

class MatrixActionLogger():
    def __init__(self, matrix, constant_matrix=None):
        """
        Args:
            matrix (list): The list representation of the matrix
            constant_matrix (list, optional): The list representation of
                        the constant matrix if the "container matrix" is
                        an augmented one.
        """
        # Reference to the Matrix.data in order to keep track of what
        # it is currently equal too.
        self.curr_matrix = matrix

        # Reference to the Matrix.constant_matrix in order to keep
        # track of what it is currently equal too.
        self.curr_constant_matrix = constant_matrix


        # List to track row operations performed on the matrix.
        # Each entry:
        # - tuple[0]: The row operation performed on the previous matrix
        #       to obtain the matrix in tuple[1] and subsequently in tuple[2].
        # - tuple[1]: A copy of the matrix at that point in time.
        # - tuple[2]: A copy of the constant matrix at that point in time.
        
        # Initialize with the starting matrix.
        self.row_op_content = []

        # Add starting matrix content
        starting_matrix_content = f"""
            <button id="row-op-0" class="row-op-btn">
            Starting Matrix  
            </button>
            """
        self.update_row_op_content(starting_matrix_content)
    

    def stringify_matrix_entries(self, matrix: list) -> list:
        """
        Returns a deep copy of matrix in which each entry is a str.
        """

        matrix_cpy = deepcopy(matrix)

        for i, row in enumerate(matrix_cpy):
            for j, entry in enumerate(row):
                matrix_cpy[i][j] = str(entry)
        
        return matrix_cpy
    

    def update_row_op_content(self, content) -> None:
        """Adds passed content to self.row_op_content"""
        if self.curr_constant_matrix:
            self.row_op_content.append((content,
                                        self.stringify_matrix_entries(self.curr_matrix),
                                        self.stringify_matrix_entries(self.curr_constant_matrix),
                                    ))
        else:
            self.row_op_content.append((content,
                                        self.stringify_matrix_entries(self.curr_matrix),
                                        None
                                    ))


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
            # An invalid row operation method called this function
            return

        # A valid row operation method called this function
        # so update self.row_op_content
        html_content += f"\n{row_op_label}" + "\n</button>"
        self.update_row_op_content(html_content)