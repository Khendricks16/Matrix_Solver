import inspect
from copy import deepcopy

class MatrixActionLogger():
    def __init__(self):
        
        
        # List used for keeping track of all row operations
        # that were performed on a given matrix.
        # List should contain tuples of length 2 where,
        # 
        # tuple[0] is a copy of the matrix at that point
        # in time.
        # 
        # tuple[1] is the row operation that just took
        # to obtain the matrix at tuple[0]
        self.row_operations = []


    def record_elementary_row_op(self, matrix: list, *args) -> None:
        # Get the name of function that called
        # this method
        caller_function = inspect.stack()[1].function

        # Generate HTML for row operation
        html_content = """
            <button class="row-operations-btn">
                {}
            </button>
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
        self.row_operations.append((deepcopy(matrix), html_content.format(row_op_label)))