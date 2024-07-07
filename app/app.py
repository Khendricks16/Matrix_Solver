from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("welcome.html")

@app.route("/3x3Solver")
def threexthree_solver():
    return render_template("3x3_solver.html")

@app.route("/4x4Solver")
def fourxfour_solver():
    return render_template("4x4_solver.html")

@app.route("/nxnSolver")
def nxn_solver():
    return render_template("nxn_solver.html")

@app.route("/how-to-solve?")
def how_to_solve():
    return render_template("how_to_solve.html")