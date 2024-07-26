from flask import Flask
from flask import render_template, request, abort, jsonify

from app.matrix import AugmentedMatrix

from fractions import Fraction


app = Flask(__name__)


# Helper functions
def is_valid_matrix_dimensions(m: str, n: str) -> bool:

    if not m.isnumeric() or not n.isnumeric():
        return False

    try:
        if not int(m) > 0 or not int(m) <= 10:
            # Invalid m
            return False
        elif not int(n) > 1 or not int(n) <= 10:
            # Invalid n
            return False
        else:
            # Both are valid dimensions
            return True
    except ValueError:
        # Both dimensions were not integers
        return False


def process_matrix_data(data: dict, m: int, n: int) -> list:
    user_matrix_data = []
    curr_row = []

    try:
        for i, entry in enumerate(data):
            # End of row has been reached, start a new row.
            if (i + 1) % n == 0:
                curr_row.append(Fraction(data[entry]))
                user_matrix_data.append(curr_row)

                curr_row = []

            else:
                curr_row.append(Fraction(data[entry]))

    except ValueError:
        # Invalid Entry
        abort(400, description="Invalid Matrix Values")

    # Something went wrong as there are not as many rows
    # as there should be
    if len(user_matrix_data) != m:
        abort(400, description="Invalid Matrix Values")

    return user_matrix_data


def process_constant_matrix_data(data: dict, m: int) -> list:
    user_matrix_data = []

    try:
        for entry in data:
            user_matrix_data.append([Fraction(data[entry])])

    except ValueError:
        # Invalid Entry
        abort(400, description="Invalid Matrix Values")

    if len(user_matrix_data) != m:
        abort(400, description="Invalid Matrix Values")

    return user_matrix_data


def solve_system_of_equations(matrix):
    if request.form.get("method") == "gaussian-elimination":
        matrix.gaussian_elimination()

    elif request.form.get("method") == "gauss-jordan-elimination":
        matrix.gaussian_elimination(gauss_jordan=True)
    else:
        abort(400, description="Invalid solving method")


# Routed functions
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/system-of-equations", methods=["GET", "POST"])
def system_of_equations():
    if request.method == "GET":
        return render_template("system-of-equations.html")

    elif request.method == "POST":
        # Get full augmented matrix dimension parameters
        m = request.form.get('m', '')
        n = request.form.get('n', '')

        # Get augmented matrix data
        coefficient_matrix_data = dict(filter(lambda pair: pair[0].find("entry") != -1, request.form.items()))
        constant_matrix_data = dict(filter(lambda pair: pair[0].find("constantEntry") != -1, request.form.items()))


        # Process user data
        if not is_valid_matrix_dimensions(m, n):
            # Invalid dimensions
            abort(400, description="Invalid Matrix Dimensions")
        else:
            # Valid dimensions
            m, n = int(m), int(n)

        coefficient_matrix = process_matrix_data(coefficient_matrix_data, m, n - 1)
        constant_matrix = process_constant_matrix_data(constant_matrix_data, m)

        # Define matrix from validated user data
        augmented_matrix = AugmentedMatrix(coefficient_matrix, constant_matrix, dimension=(m, n))

        # Solve matrix
        solve_system_of_equations(augmented_matrix)

        # Return solved data
        row_operations_html = render_template("solved_systems_of_equations_content.html",
                                              solved_matrix=augmented_matrix)
        coefficient_matrices = list(i[1] for i in augmented_matrix.content_generator.row_op_content)
        constant_matrices = list(i[2] for i in augmented_matrix.content_generator.row_op_content)

        return jsonify({
            "rowOperationsHTML": row_operations_html,
            "coefficientMatrices": coefficient_matrices,
            "constantMatrices": constant_matrices
        })


@app.route("/how-to-solve")
def how_to_solve():
    return render_template("how_to_solve.html")
