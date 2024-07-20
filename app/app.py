from flask import Flask
from flask import render_template, request, abort

from app.matrix import Matrix

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
    

def process_matrix_data(data, m, n) -> list:
    user_matrix_data = []
    
    curr_row = []
    for i, entry in enumerate(data):
        try:
            if i % n == 0:
                # Start of a new row
                if curr_row:
                    user_matrix_data.append(curr_row)
                
                curr_row = []

            curr_row.append(Fraction(data[entry]))
    

        except ValueError:
        # Invalid Entry
            abort(400, description="Invalid Matrix Values")

    # End of loop, account for very last row as well
    user_matrix_data.append(curr_row)


    user_matrix = Matrix(user_matrix_data, (m, n))
    return user_matrix

def solve_system_of_equations(matrix, m, n):
    if request.args.get("method") == "gaussian-elimination":
        matrix.gaussian_elimination()

    elif request.args.get("method") == "gauss-jordan-elimination":
        matrix.gaussian_elimination(gauss_jordan=True)


# Routed functions
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/system-of-equations", methods=["GET", "POST"])
def system_of_equations():
    if request.method == "GET":
        return render_template("system-of-equations.html")
    
    elif request.method == "POST":
        # Get matrix parameters
        m = request.args.get('m', '') 
        n = request.args.get('n', '')

        # Get augmented matrix
        augmented_matrix = request.form

        # Handle user data
        if not is_valid_matrix_dimensions(m, n):
            # Invalid dimensions
            abort(400, description="Invalid Matrix Dimensions")
        else:
            # Valid dimensions
            m, n = int(m), int(n)

        augmented_matrix = process_matrix_data(augmented_matrix, m, n)

        # Solve matrix
        solve_system_of_equations(augmented_matrix, m, n)

        return render_template("system-of-equations.html",
                            generated_matrix_content=augmented_matrix.content_generator)


@app.route("/how-to-solve")
def how_to_solve():
    return render_template("how_to_solve.html")