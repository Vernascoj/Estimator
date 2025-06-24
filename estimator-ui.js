
const e = React.createElement;

function EstimatorApp() {
  const [message, setMessage] = React.useState("Welcome to the full Estimator App");

  return e("div", {},
    e("h1", {}, "Estimator App"),
    e("p", {}, message),
    e("button", { onClick: () => setMessage("Estimator Running Full UI!") }, "Start Estimating")
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(e(EstimatorApp));
