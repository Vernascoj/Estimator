import React, { useState } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

function App() {
  const [started, setStarted] = useState(false);
  return (
    <div>
      {!started ? (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
          <h1>Estimator App</h1>
          <p>Estimator Running Full UI!</p>
          <button onClick={() => setStarted(true)}>Start Estimating</button>
        </div>
      ) : (
        <div className="card">
          <h2>Full Estimator Loaded</h2>
          <p>This is a placeholder for the full app functionality.</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(React.createElement(App), document.getElementById("app"));