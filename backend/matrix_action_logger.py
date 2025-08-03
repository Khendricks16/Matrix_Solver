import inspect
from copy import deepcopy


class MatrixActionLogger():
    def __init__(self, parent_matrix, parent_constant_matrix=None):
        """
        Records the information of different actions/operations performed on
        the "parent" Matrix.data matrix from its different methods.

        Args:
            parent_matrix (list): The list representation of the
                        parent matrix
            parent_constant_matrix (list, optional): The list representation
                        of the constant matrix if the parent matrix is an
                        augmented one.
        """

        # Reference to the parent Matrix.data
        self.parent_matrix = parent_matrix

        # Reference to the parent Matrix.constant_matrix
        self.parent_constant_matrix = parent_constant_matrix

        # Tracks the row operations performed on the parent matrix.
        #
        # self.row_ops_content is a List with 3 elements:
        #
        # - self.row_ops_content[0]: A list of tuples with each tuple representing
        #   information on the row operation performed on the (i-1)th matrix.
        #   The tuples describe the operation that transforms the matrix in
        #   self.row_ops_content[1][i-1] to the matrix in self.row_ops_content[1][i],
        #   and similarly for self.row_ops_content[2].
        #
        # - self.row_ops_content[1]: A list containing deep copies of each
        #   state of self.parent_matrix.
        #
        # - self.row_ops_content[2]: A list containing deep copies of each
        #   state of self.parent_constant_matrix.

        self.row_ops_content = [[], [], []]

        # Initialize with the starting matrix.
        self.update_row_ops_content(tuple(["Starting Matrix"]))

    def update_row_ops_content(self, row_op_info: tuple) -> None:
        """ Updates self.row_ops_content. """

        self.row_ops_content[0].append(row_op_info)
        self.row_ops_content[1].append(self.deepcopy_matrix_to_str(self.parent_matrix))

        if self.parent_constant_matrix:
            self.row_ops_content[2].append(self.deepcopy_matrix_to_str(self.parent_constant_matrix))
        else:
            self.row_ops_content[2].append(None)

    def deepcopy_matrix_to_str(self, matrix: list) -> list:
        """
        Returns a deep copy of matrix in which each entry is a str.
        """

        matrix_cpy = deepcopy(matrix)

        for i, row in enumerate(matrix_cpy):
            for j, entry in enumerate(row):
                matrix_cpy[i][j] = str(entry)

        return matrix_cpy

    # Methods to be called from parent/container class
    def record_elementary_row_op(self, *args) -> None:
        # Get the name of function that called
        # this method
        caller_function = inspect.stack()[1].function

        # Record all necessary information on the elementary row
        # operation taking place in the parent class.
        row_op_info = None

        if caller_function == "swap_rows":
            row_op_info = ("swap_rows", str(args[0] + 1), str(args[1] + 1))
        elif caller_function == "multiply_row":
           row_op_info = ("multiply_row", str(args[0] + 1), str(args[1]))
        elif caller_function == "row_multiple_to_row":
            row_op_info = ("row_multiple_to_row", str(args[0] + 1), str(args[1]), str(args[2] + 1))
        else:
            # The caller function was not a row operation method
            # logger.warning("Invalid method has called record_elementary_row_op()")
            return

        # A valid row operation method called this function
        # so update self.row_ops_content
        self.update_row_ops_content(row_op_info)
