import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary';

// Pages
import Welcome from "./pages/Welcome.jsx";

import SystemsOfEquations from "./pages/systemsOfEquations/SystemsOfEquations.jsx";
import { SystemsOfEquationsProvider } from "./pages/systemsOfEquations/SystemsOfEquationsContext.jsx";

// Components
import PageOptions from "./components/global/pageOptions/PageOptions.jsx";


function App() {

  return (
  <ErrorBoundary fallback={<h1>Something went wrong :(</h1>}>
    <header><h1>Matrix Solver</h1></header>
    <main>
        <PageOptions></PageOptions>
        <Routes>
          <Route 
            path="/" 
            element={<Welcome />} 
          />
          <Route 
            path="/system-of-equations" 
            element={
              <SystemsOfEquationsProvider>
                <SystemsOfEquations />
              </SystemsOfEquationsProvider>
            } 
          />
      </Routes>
    </main>
    <footer><hr />Made By: Keith Hendricks</footer>
  </ErrorBoundary>
  )
}

export default App;