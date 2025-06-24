
const { useState } = React;

function EstimatorApp() {
  const [group, setGroup] = useState("NorCal");
  const [perDiemOn, setPerDiemOn] = useState(false);
  const [perDiemDays, setPerDiemDays] = useState(0);
  const [profitPercent, setProfitPercent] = useState(30);
  const [rentalCosts, setRentalCosts] = useState([{ label: "Lift Rental", cost: 150 }]);
  const [travelCosts, setTravelCosts] = useState([{ label: "Fuel", cost: 60 }]);
  const [hoursWorked, setHoursWorked] = useState([
    { type: "Work", duration: 8.5 },
    { type: "Drive", duration: 1.25 }
  ]);
  const [employees, setEmployees] = useState([
    { name: "John Smith", rate: 27, salaried: false },
    { name: "Sarah Johnson", rate: 30, salaried: true }
  ]);

  const laborCosts = employees.reduce((sum, emp) => {
    const hours = emp.salaried ? 8 : hoursWorked.reduce((h, e) => h + e.duration, 0);
    return sum + hours * emp.rate;
  }, 0);

  const driveCosts = hoursWorked
    .filter(e => e.type === "Drive")
    .reduce((s, e) => s + e.duration * 17.5, 0);

  const averageExpenses = 200;
  const rentalTotal = rentalCosts.reduce((s, r) => s + (r.cost || 0), 0);
  const travelTotal = travelCosts.reduce((s, r) => s + (r.cost || 0), 0);
  const perDiemTotal = perDiemOn ? perDiemDays * 50 : 0;

  const subtotal = laborCosts + driveCosts + averageExpenses + rentalTotal + travelTotal + perDiemTotal;
  const profit = subtotal * (profitPercent / 100);
  const total = subtotal + profit;

  return (
    <div>
      <h1>Estimator App</h1>
      <div className="card">
        <h2>Employees</h2>
        {employees.map((emp, idx) => (
          <div key={idx}>
            <strong>{emp.name}</strong> - ${emp.rate}/hr - 
            <button onClick={() => {
              const updated = [...employees];
              updated[idx].salaried = !updated[idx].salaried;
              setEmployees(updated);
            }}>
              {emp.salaried ? "Salaried" : "Hourly"}
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Hours Worked</h2>
        {hoursWorked.map((entry, i) => (
          <div key={i}>{entry.type}: {entry.duration} hrs</div>
        ))}
      </div>

      <div className="card">
        <h2>Per Diem</h2>
        <label>
          <input type="checkbox" checked={perDiemOn} onChange={(e) => setPerDiemOn(e.target.checked)} />
          Enable Per Diem
        </label>
        {perDiemOn && (
          <label>
            Days:
            <input type="number" value={perDiemDays} onChange={(e) => setPerDiemDays(parseInt(e.target.value) || 0)} />
          </label>
        )}
      </div>

      <div className="card">
        <h2>Rental Costs</h2>
        {rentalCosts.map((r, i) => (
          <div key={i}>{r.label}: ${r.cost}</div>
        ))}
      </div>

      <div className="card">
        <h2>Travel Costs</h2>
        {travelCosts.map((t, i) => (
          <div key={i}>{t.label}: ${t.cost}</div>
        ))}
      </div>

      <div className="card">
        <h2>Estimator Report</h2>
        <p>Labor Costs: ${laborCosts.toFixed(2)}</p>
        <p>Drive Costs: ${driveCosts.toFixed(2)}</p>
        <p>Average Expenses: ${averageExpenses.toFixed(2)}</p>
        <p>Per Diem: ${perDiemTotal.toFixed(2)}</p>
        <p>Rental: ${rentalTotal.toFixed(2)}</p>
        <p>Travel: ${travelTotal.toFixed(2)}</p>
        <label>
          Profit %:
          <input type="number" value={profitPercent} onChange={(e) => setProfitPercent(parseFloat(e.target.value) || 0)} />
        </label>
        <p><strong>Total Cost: ${total.toFixed(2)}</strong></p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(EstimatorApp));
