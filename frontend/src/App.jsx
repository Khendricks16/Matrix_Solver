import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';

import Welcome from "./pages/Welcome.jsx";
import SystemsOfEquations from "./pages/systemsOfEquations/SystemsOfEquations.jsx";

import PageOptions from "./components/pageOptions/PageOptions.jsx";


function App() {

  return (
  <ErrorBoundary fallback={<h1>Something went wrong :(</h1>}>
    <header><h1>Matrix Solver</h1></header>
    <main>
        <PageOptions></PageOptions>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/system-of-equations" element={<SystemsOfEquations />} />
      </Routes>
    </main>
    <footer><hr />Made By: Keith Hendricks</footer>
  </ErrorBoundary>
  )
}

export default App;