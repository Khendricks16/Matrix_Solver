from flask import Flask
from flask import render_template, request, abort

from app.matrix import Matrix

from fractions import Fraction

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

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

@app.route("/system-of-equations", methods=['GET', 'POST'])
def system_of_equation():
    # Get dimension parameters
    m = request.args.get('m') if request.args.get('m') else str()
    n = request.args.get('n') if request.args.get('n') else str()

    # User hasn't submitted any data for matrix dimensions
    if request.method == 'GET' and not m and not n:
        return render_template("system-of-equations.html", dimensions=(0,0))

    # Validate Matrix Dimensions
    if not is_valid_matrix_dimensions(m, n):
        # Invalid dimensions
        abort(400, description="Invalid Matrix Dimensions")
    else:
        # Valid dimensions
        m, n = int(m), int(n)
    
    # User has submitted proper data for matrix dimensions
    if request.method == 'GET':
        return render_template("system-of-equations.html", dimensions=(m, n))


    # User submitted Matrix data
    if request.method == 'POST':
        matrix = process_matrix_data(request.form, m, n)
        
        # Solve System
        if request.args.get("method") == "gaussian-elimination":
            matrix.gaussian_elimination()
        elif request.args.get("method") == "gauss-jordan-elimination":
            matrix.gaussian_elimination(gauss_jordan=True)
        
        # TODO: Implement updates to Row Operations section of page

        return render_template("system-of-equations.html", dimensions=(m, n))


@app.route("/how-to-solve")
def how_to_solve():
    return render_template("how_to_solve.html")