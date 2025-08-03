from flask import Flask
from flask import request, abort, jsonify, send_from_directory

from backend.matrix import AugmentedMatrix

from fractions import Fraction


app = Flask(__name__, static_folder="../frontend/dist", static_url_path='')


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
    if request.json["method"] == "gaussian-elimination":
        matrix.gaussian_elimination()

    elif request.json["method"] == "gauss-jordan-elimination":
        matrix.gaussian_elimination(gauss_jordan=True)
    else:
        abort(400, description="Invalid solving method")


# Routed functions
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/system-of-equations", methods=["POST"])
def system_of_equations():
    if request.method == "POST":
        """
        # Get full augmented matrix dimension parameters
        m = request.form.get('m', '')
        n = request.form.get('n', '')

        # Get augmented matrix data
        coefficient_matrix_data = request.form.get("matrix", "")
        constant_matrix_data = request.form.get("constMatrix", "")


        # Process user data
        if not is_valid_matrix_dimensions(m, n):
            # Invalid dimensions
            abort(400, description="Invalid Matrix Dimensions")
        else:
            # Valid dimensions
            m, n = int(m), int(n)

        coefficient_matrix = process_matrix_data(coefficient_matrix_data, m, n - 1)
        constant_matrix = process_constant_matrix_data(constant_matrix_data, m)

        """
        # TMP QUICK DEFINITION
        coefficient_matrix = request.json["matrix"]
        constant_matrix = request.json["constMatrix"]
        for i, row in enumerate(coefficient_matrix):
            for j, num in enumerate(row):
                coefficient_matrix[i][j] = Fraction(num)
        
        for i, row in enumerate(constant_matrix):
            for j, num in enumerate(row):
                constant_matrix[i][j] = Fraction(num)

        m = request.json["m"]
        n = request.json["n"]



        # Define matrix from validated user data
        augmented_matrix = AugmentedMatrix(coefficient_matrix, constant_matrix, dimension=(m, n))

        # Solve matrix
        solve_system_of_equations(augmented_matrix)

        # Return solved data
        row_ops_content = augmented_matrix.action_logger.row_ops_content

        return jsonify({
            "rowOperationsContent": row_ops_content
        })
