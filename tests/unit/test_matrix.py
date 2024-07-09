from app.matrix import Matrix

from fractions import Fraction
import random
from copy import deepcopy

# Used for checking if matrices are in REF or RREF.
from sympy import Matrix as SympyMatrix

import pytest


# Set seed to ensure reproducibility of tests
random.seed(52)


class TestElementaryRowOperations():
    @pytest.fixture
    def sample_matrix(self):
        return Matrix([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ], (3, 3))

    def test_swap_rows(self, sample_matrix):
        sample_matrix.swap_rows(0, 1)

        expected = [
            [4, 5, 6],
            [1, 2, 3],
            [7, 8, 9]
        ]
        assert sample_matrix.data == expected

    def test_multiply_row(self, sample_matrix):
        sample_matrix.multiply_row(0, 10)

        expected = [
            [10, 20, 30],
            [4, 5, 6],
            [7, 8, 9]
        ]
        assert sample_matrix.data == expected

    def test_add_multiple_of_row(self, sample_matrix):
        sample_matrix.row_multiple_to_row(2, -7, 0)

        expected = [
            [1, 2, 3],
            [4, 5, 6],
            [0, 8 + (-7 * 2), 9 + (-7 * 3)]
        ]
        assert sample_matrix.data == expected


class TestGaussianElimination():

    # Test Helper Methods for Matrix.gaussian_elimination()
    def test_eliminate_entries(self):
        """
        Should eliminate entries below first pivot point of a matrix.
        A large variety of entries are tested.
        """

        # Matrix data that will be tested, starting with the first
        # entry to be a row with the value 1, to serve as a normalized
        # pivot point
        matrix_data = [[1]]

        # Add random pos & neg integers and fractions below pivot point
        for i in range(20):
            # Random integer entries
            matrix_data.append([random.randint(-100, 100)])
            # Random fraction entires
            matrix_data.append([Fraction(random.randint(-100, 100), random.randint(-100, 100))])

        # Ensure special cases are tested
        matrix_data.append([0])
        matrix_data.append([-0.0])
        matrix_data.append([0.000001])

        # 44x1 matrix with a variety of entries below the pivot point
        A = Matrix(matrix_data, (44, 1))

        # Test data
        A._eliminate_entries((0, 0), direction="below")
        assert A.data == [[1]] + list([0] for i in range(43))

    def test_swap_zero_rows(self):
        """
        Should move all rows consisting of only zeros below any rows
        with any non-zero entries.
        """

        # Add 50 non-zero rows to matrix data
        matrix_data = list([1] for i in range(50))

        # Add 50 zero rows to matrix data
        matrix_data += list([0] for i in range(50))

        # Shuffle rows
        random.shuffle(matrix_data)

        # A 100x1 matrix with zero & non-zero rows in a random order
        A = Matrix(deepcopy(matrix_data), (100, 1))

        # Test data
        A._swap_zero_rows()
        assert A.data == sorted(matrix_data, reverse=True)

    def test_swap_zero_rows_vary_entries(self):
        """
        Should move all rows consisting of only zeros below any rows
        with any non-zero entries. The rows with non-zero entries
        will have a variety of special values tested.
        """

        for entry in [0.0001, -1, 1, Fraction(5, 77), Fraction(-5, 77)]:
            matrix_data = [
                [0],
                [entry]
            ]

            # A 2x1 matrix with non-zero row below the zero row
            A = Matrix(matrix_data, (2, 1))

            # Test data
            A._swap_zero_rows()
            assert A.data == [[entry], [0]]

    # Test Matrix.gaussian_elimination()
    @pytest.fixture
    def zero_pivot_matrix_data(self):
        return [
            [0, 1, -1],
            [-3, -1, 2],
            [-2, 1, 2]
        ]

    @pytest.fixture
    def all_zero_rows_matrix_data(self):
        return [
            [2, 1, -1],
            [0, 0, 0],
            [-2, 1, 2]
        ]

    @pytest.fixture
    def all_zero_columns_matrix_data(self):
        return [
            [0, 0, -1],
            [0, 0, 2],
            [0, 0, 2]
        ]

    @pytest.fixture
    def fraction_matrix_data(self):
        return [
            [Fraction(1.5), Fraction(2.5), Fraction(-1.5)],
            [Fraction(3.0), Fraction(-1.0), Fraction(2.0)],
            [Fraction(-2.0), Fraction(0.5), Fraction(1.5)]
        ]

    @pytest.fixture
    def single_row_matrix_data(self):
        return [
            [1, 2, 3]
        ]

    @pytest.fixture
    def single_column_matrix_data(self):
        return [
            [1],
            [2],
            [3]
        ]

    @pytest.fixture
    def non_square_matrix_data(self):
        return [
            [2, 1, -1, 0],
            [-3, -1, 2, 1],
            [-2, 1, 2, -1]
        ]

    @pytest.fixture
    def already_echelon_matrix_data(self):
        return [
            [1, 2, 3],
            [0, 1, 2],
            [0, 0, 1]
        ]

    @pytest.fixture
    def singular_matrix_data(self):
        return [
            [1, 2, 3],
            [2, 4, 6],
            [3, 6, 9]
        ]

    @pytest.fixture
    def no_solution_matrix_data(self):
        return [
            [2, 1, -1, 1],
            [-3, -1, 2, -1],
            [2, 1, -1, 0]
        ]

    @pytest.fixture
    def infinite_solutions_matrix_data(self):
        return [
            [1, 1, 1, 1],
            [2, 2, 2, 2],
            [3, 3, 3, 3]
        ]

    def test_gaussian_elimination_zero_pivot(self, zero_pivot_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(zero_pivot_matrix_data), (3, 3))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(zero_pivot_matrix_data), (3, 3))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(zero_pivot_matrix_data).rref()[0]

    def test_gaussian_elimination_all_zero_rows(self, all_zero_rows_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(all_zero_rows_matrix_data), (3, 3))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(all_zero_rows_matrix_data), (3, 3))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(all_zero_rows_matrix_data).rref()[0]

    def test_gaussian_elimination_all_zero_columns(self, all_zero_columns_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(all_zero_columns_matrix_data), (3, 3))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(all_zero_columns_matrix_data), (3, 3))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(all_zero_columns_matrix_data).rref()[0]

    def test_gaussian_elimination_fraction(self, fraction_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(fraction_matrix_data), (3, 3))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(fraction_matrix_data), (3, 3))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(fraction_matrix_data).rref()[0]

    def test_gaussian_elimination_single_row(self, single_row_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(single_row_matrix_data), (1, 3))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(single_row_matrix_data), (1, 3))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(single_row_matrix_data).rref()[0]

    def test_gaussian_elimination_single_column(self, single_column_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(single_column_matrix_data), (3, 1))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(single_column_matrix_data), (3, 1))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(single_column_matrix_data).rref()[0]

    def test_gaussian_elimination_non_square(self, non_square_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(non_square_matrix_data), (3, 4))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(non_square_matrix_data), (3, 4))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(non_square_matrix_data).rref()[0]

    def test_gaussian_elimination_already_echelon(self, already_echelon_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(already_echelon_matrix_data), (3, 3))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(already_echelon_matrix_data), (3, 3))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(already_echelon_matrix_data).rref()[0]

    def test_gaussian_elimination_singular(self, singular_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(singular_matrix_data), (3, 3))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(singular_matrix_data), (3, 3))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(singular_matrix_data).rref()[0]

    def test_gaussian_elimination_no_solution(self, no_solution_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(no_solution_matrix_data), (3, 4))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(no_solution_matrix_data), (3, 4))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(no_solution_matrix_data).rref()[0]

    def test_gaussian_elimination_infinite_solutions(self, infinite_solutions_matrix_data):
        # gaussian elimination
        A = Matrix(deepcopy(infinite_solutions_matrix_data), (3, 4))
        A.gaussian_elimination()
        assert SympyMatrix(A.data).is_echelon

        # gauss-jordan elimination
        B = Matrix(deepcopy(infinite_solutions_matrix_data), (3, 4))
        B.gaussian_elimination(gauss_jordan=True)
        assert SympyMatrix(B.data) == SympyMatrix(infinite_solutions_matrix_data).rref()[0]

    def test_gaussian_elimination_vary_matrices(self):
        """Should convert matrices into REF and RREF."""

        # Test 1000 randomly generated matrices.
        # Each matrix is of random dimension and entries.
        # The max dimension for a matrix is a 10x10.
        for i in range(1000):
            # Random dimension for matrix from where m or n could be 1-10
            m, n = random.randint(1, 10), random.randint(1, 10)

            matrix_data = []

            for _ in range(m):
                # Each entry in rows could be integers from -100 to 100
                row_data = list(random.randint(-100, 100) for i in range(n))
                matrix_data.append(row_data)

            # gaussian elimination
            A = Matrix(deepcopy(matrix_data), (m, n))
            A.gaussian_elimination()
            assert SympyMatrix(A.data).is_echelon

            # gauss-jordan elimination
            B = Matrix(deepcopy(matrix_data), (m, n))
            B.gaussian_elimination(gauss_jordan=True)
            assert SympyMatrix(B.data) == SympyMatrix(matrix_data).rref()[0]
