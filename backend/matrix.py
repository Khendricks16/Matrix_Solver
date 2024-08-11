from backend.matrix_action_logger import MatrixActionLogger

# Used for checking if matrices are already in REF or RREF.
from sympy import Matrix as SympyMatrix

from fractions import Fraction


class Matrix():
    def __init__(self, data: list, dimension: tuple):
        """
        Args:
            data (list): The list representation of a matrix
            dimension (tuple): Contains the m by n dimensions for a matrix
                        in the form of (m, n)
        """

        self.data = data
        self.m = dimension[0]
        self.n = dimension[1]

        # Set action logger
        self.action_logger = MatrixActionLogger(self.data)

        # Used to keep track of pivot point locations while turning matrix
        # into REF through gaussian elimination. This way, when performing
        # additional steps for putting the matrix into RREF, all pivot points
        # are already known.
        # 0: (row index, column index) - First pivot point
        # 1: (row, index, column index) - Second pivot point
        # ...
        self._pivot_point_locations = dict()

    # Elementary Row Operations
    def swap_rows(self, row_1, row_2):
        """
        Interchange two rows:
        R_1 <-> R_2
        """
        self.data[row_1], self.data[row_2] = self.data[row_2], self.data[row_1]

        # Log action
        self.action_logger.record_elementary_row_op(row_1, row_2)

    def multiply_row(self, row, constant):
        """
        Multiply a row by a nonzero constant c:
        c * R_i
        """
        if constant == 0:
            return

        for i in range(len(self.data[row])):
            # Avoid -0.0 instances
            if self.data[row][i] == 0:
                continue

            self.data[row][i] *= constant

        # Log action
        self.action_logger.record_elementary_row_op(row, constant)

    def row_multiple_to_row(self, row_2, scalar, row_1):
        """
        Add a multiple of a row to another row:
        R_2:= R_2 + (scalar)*R_1
        """

        for i in range(len(self.data[row_2])):
            self.data[row_2][i] += (scalar * self.data[row_1][i])

        # Log action
        self.action_logger.record_elementary_row_op(row_2, scalar, row_1)

    # Helper Methods for Gaussian Elimination
    def _eliminate_entries(self, pivot_point_location: tuple, direction: str = "below") -> None:
        """
        Turn all entries under the pivot point given by pivot_point_location
        into 0's through row operations.

        Args:
            pivot_point_location (tuple): Location for pivot point you want to
                eliminate entries above or below from. This tuple should take
                the form of (row index, column index) for locating the
                pivot point within the matrix
            direction (str, optional): Direction of elimination,
                either "above" or "below". Default is "below".
        """

        for curr_row, row in enumerate(self.data):
            # Ignore row if it is the row where the pivot point is located
            # or any rows above that when eliminating below.
            if curr_row <= pivot_point_location[0] and direction == "below":
                continue

            # Ignore rows that already have entries eliminated when
            # eliminating above.
            if curr_row >= pivot_point_location[0] and direction == "above":
                continue

            # Entry is already 0
            if row[pivot_point_location[1]] == 0:
                continue
            # Entry is non-zero
            else:
                self.row_multiple_to_row(curr_row, -row[pivot_point_location[1]], pivot_point_location[0])

    def _swap_zero_rows(self) -> None:
        # Move all of the zero rows under all of the non-zero rows
        top_pointer = 0
        bottom_pointer = self.m - 1

        while top_pointer != bottom_pointer:
            if not any(self.data[top_pointer]) and any(self.data[bottom_pointer]):
                self.swap_rows(top_pointer, bottom_pointer)
                top_pointer += 1
            elif not any(self.data[top_pointer]) and not any(self.data[bottom_pointer]):
                bottom_pointer -= 1
            else:
                top_pointer += 1

    def _reached_base_case(self, gauss_jordan=False) -> None:
        # All possible pivots have been normalized and entries below
        # them have been eliminated

        # Move all zero rows under all non-zero rows
        self._swap_zero_rows()
        # End of gaussian elimination, matrix is now in REF

        # Perform additional steps for gauss-jordan elimination if desired
        if gauss_jordan:
            for key in reversed(sorted(self._pivot_point_locations.keys())):
                self._eliminate_entries(self._pivot_point_locations[key], direction="above")
                # End of gauss-jordan elimination, matrix is now in RREF

    # Composite Method: Gaussian Elimination
    def gaussian_elimination(self, pivots_normalized: int = 0, gauss_jordan: bool = False) -> None:
        """
        Recursive function to normalize all pivot points within the matrix
        and eliminate all entries below them. This effectively turns the
        matrix into REF.

        If gauss_jordan is set to True, then further operations will take
        place, effectively turning the matrix into RREF.

        Args:
            pivots_normalized (int, optional): pivots_normalized is used to
                keep track of how many pivots have already been normalized
                for use in the elimination algorithm

            gauss_jordan (bool, optional): Performs additional steps to get
                matrix into RREF. Default value is False.
        """

        # Before starting any elimination, check to make sure if the matrix is
        # already in the desired REF or RREF. If so, don't do anything.
        if pivots_normalized == 0:
            matrix_for_checking = SympyMatrix(self.data.copy())

            if not gauss_jordan and matrix_for_checking.is_echelon:
                # Already in desired REF
                return
            elif gauss_jordan and matrix_for_checking == matrix_for_checking.rref()[0]:
                # Already in desired RREF
                return

        # Get the smallest dimension of the matrix
        smallest_dimension = self.m if self.m < self.n else self.n

        # Base case: Last pivot has been normalized
        if pivots_normalized == smallest_dimension:
            self._reached_base_case(gauss_jordan=gauss_jordan)
            return

        # Not all columns are guaranteed to be iterated through as
        # the function will recurse once a pivot is normalized
        # and return afterwards
        curr_column = pivots_normalized

        # Infinite loop will be broken out of by a return statement, once all
        # pivots are normalized
        while True:
            try:
                # Current entry in the column for pivot point is already 1
                if self.data[pivots_normalized][curr_column] == 1:
                    # Current pivot is normalized,
                    # so eliminate entries below it
                    self._eliminate_entries(pivot_point_location=(pivots_normalized, curr_column), direction="below")

                    # Keep track of pivot point location
                    self._pivot_point_locations[pivots_normalized] = (pivots_normalized, curr_column)

                    # Continue to next pivot
                    self.gaussian_elimination(pivots_normalized=pivots_normalized + 1, gauss_jordan=gauss_jordan)
                    return
            # Base case: There was a zero in the very last
            # pivot point of the matrix
            except IndexError:
                self._reached_base_case(gauss_jordan=gauss_jordan)
                return

            # Used for saving an extra elementary operation if an entry
            # in the column, under the pivot point has a -1, but there is also
            # another entry somewhere under that one which has a 1
            row_with_neg_one = (False, 0)  # (boolean, row index)

            # If a (1 / #)*R_i operation is needed, keep track of
            # the row that would have the most number of whole numbers
            # entries after the operation.
            largest_whole_num_row = (0, 0)  # (row index, num of whole numbers)

            # Used for keeping track of all the values in the current column
            column_values = set()

            for curr_row, row in enumerate(self.data):
                # Ignore rows that above the current pivot point
                if curr_row < pivots_normalized:
                    continue

                # Ignore entries with 0's
                if row[curr_column] == 0:
                    column_values.add(0)
                    continue

                # Do a swap rows operation if another row in the matrix
                # already has a 1 or -1 within the pivot column
                if curr_row != pivots_normalized and row[curr_column] == 1:
                    # Another row has a 1, so swap with that row
                    self.swap_rows(pivots_normalized, curr_row)

                    # Current pivot is normalized,
                    # so eliminate entries below it
                    self._eliminate_entries(pivot_point_location=(pivots_normalized, curr_column), direction="below")

                    # Keep track of pivot point location
                    self._pivot_point_locations[pivots_normalized] = (pivots_normalized, curr_column)

                    # Continue to next pivot
                    self.gaussian_elimination(pivots_normalized=pivots_normalized + 1, gauss_jordan=gauss_jordan)
                    return

                elif row[curr_column] == -1 and row_with_neg_one[0] is False:
                    # Don't perform the swap operation in case there
                    # is another entry within the pivot column that is already
                    # 1 to save a self.multiply_row(X, -1) operation.
                    row_with_neg_one = (True, curr_row)

                # list containing the new whole numbers that would be in
                # the row if a (1 / #)*R_i operation took place in
                # the current row
                new_row_values = list(filter(lambda x: x % row[curr_column] == 0, row[curr_column:]))

                # Update largest_whole_num_row
                if len(new_row_values) > largest_whole_num_row[1]:
                    largest_whole_num_row = (curr_row, len(new_row_values))

                column_values.add(row[curr_column])

            # No row already had a 1, but there was a -1,
            # so swap rows, multiply row by -1, and continue to next pivot.
            if row_with_neg_one[0]:
                self.multiply_row(row_with_neg_one[1], -1)

                # Swap rows if needed
                if pivots_normalized != row_with_neg_one[1]:
                    self.swap_rows(pivots_normalized, row_with_neg_one[1])

                # Current pivot is normalized, so eliminate entries below it
                self._eliminate_entries(pivot_point_location=(pivots_normalized, curr_column), direction="below")

                # Keep track of pivot point location
                self._pivot_point_locations[pivots_normalized] = (pivots_normalized, curr_column)

                # Continue to next pivot
                self.gaussian_elimination(pivots_normalized=pivots_normalized + 1, gauss_jordan=gauss_jordan)
                return

            # The column consisted of all 0's
            if column_values == {0}:
                # There was no possible pivot point within this column
                # so move on to next column
                curr_column += 1
                continue

            # A (1 / #)*R_i operation is needed, so do it on the row that
            # would have the most number of whole numbers
            self.multiply_row(largest_whole_num_row[0], Fraction(1, self.data[largest_whole_num_row[0]][curr_column]))

            # Swap the row with the largest whole numbers with the
            # current pivot row if it is already not that row
            if largest_whole_num_row[0] != pivots_normalized:
                self.swap_rows(pivots_normalized, largest_whole_num_row[0])

            # Current pivot is normalized, so eliminate entries below it
            self._eliminate_entries(pivot_point_location=(pivots_normalized, curr_column), direction="below")

            # Keep track of pivot point location
            self._pivot_point_locations[pivots_normalized] = (pivots_normalized, curr_column)

            # Continue to next pivot
            self.gaussian_elimination(pivots_normalized=pivots_normalized + 1, gauss_jordan=gauss_jordan)
            return


class AugmentedMatrix(Matrix):
    def __init__(self, coefficient_matrix: list, constant_matrix: list, dimension: tuple):
        """
        Args:
            coefficient_matrix (list): The list representation of
                        the coefficient matrix.
            constant_matrix (list): The list representation of
                        the constant matrix.
            dimension (tuple): Contains the m by n dimensions for
                        the whole augmented matrix (coefficient matrix +
                        constant matrix in the form of (m, n).
        """
        # Treat coefficient_matrix like Matrix.data
        super().__init__(coefficient_matrix, dimension=(dimension[0], dimension[1] - 1))

        self.constant_matrix = constant_matrix

        # Used for generating HTML content based off of different
        # methods performed on self.data
        self.action_logger = MatrixActionLogger(self.data, parent_constant_matrix=self.constant_matrix)

    def swap_rows(self, row_1, row_2):
        # Perform row operation constant matrix
        self.constant_matrix[row_1], self.constant_matrix[row_2] = (
            self.constant_matrix[row_2],
            self.constant_matrix[row_1]
        )

        super().swap_rows(row_1, row_2)

    def multiply_row(self, row, constant):
        # Perform row operation constant matrix
        self.constant_matrix[row][0] *= constant

        super().multiply_row(row, constant)

    def row_multiple_to_row(self, row_2, integer, row_1):
        # Perform row operation constant matrix
        self.constant_matrix[row_2][0] += (integer * self.constant_matrix[row_1][0])

        super().row_multiple_to_row(row_2, integer, row_1)
