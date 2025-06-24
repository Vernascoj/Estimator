
import React, { useState } from "https://esm.sh/react";

export default function EstimatorApp() {
  const [employees, setEmployees] = useState([
    { name: "John Smith", rate: 27, salaried: false },
    { name: "Sarah Johnson", rate: 30, salaried: true },
  ]);
  const [hoursWorked, setHoursWorked] = useState([
    { type: "Work", duration: 8.5 },
    { type: "Drive", duration: 1.25 },
  ]);
  const [perDiemOn, setPerDiemOn] = useState(false);
  const [perDiemDays, setPerDiemDays] = useState(0);
  const [rentalCosts, setRentalCosts] = useState([{ label: "Lift", cost: 150 }]);
  const [travelCosts, setTravelCosts] = useState([{ label: "Fuel", cost: 60 }]);
  const [profitPercent, setProfitPercent] = useState(30);

  const totalManHours = hoursWorked.reduce((sum, h) => h.type === "Work" ? sum + h.duration : sum, 0);
  const drivingHours = hoursWorked.reduce((sum, h) => h.type === "Drive" ? sum + h.duration : sum, 0);
  const driveCost = drivingHours * 17.5;

  const getLaborCost = () => {
    return employees.reduce((total, emp) => {
      if (emp.salaried) return total + emp.rate * 8;
      let cost = 0;
      let remaining = totalManHours;
      if (remaining > 12) {
        cost += (remaining - 12) * emp.rate * 2;
        remaining = 12;
      }
      if (remaining > 8) {
        cost += (remaining - 8) * emp.rate * 1.5;
        remaining = 8;
      }
      cost += remaining * emp.rate;
      return total + cost;
    }, 0);
  };

  const laborCost = getLaborCost();
  const rentalTotal = rentalCosts.reduce((sum, r) => sum + r.cost, 0);
  const travelTotal = travelCosts.reduce((sum, t) => sum + t.cost, 0);
  const perDiemTotal = perDiemOn ? perDiemDays * 50 : 0;
  const averageExpenses = 200;
  const base = laborCost + driveCost + rentalTotal + travelTotal + perDiemTotal + averageExpenses;
  const profit = base * (profitPercent / 100);
  const totalCost = base + profit;

  return React.createElement("div", { style: { backgroundColor: "#111", color: "#fff", padding: "2rem", fontFamily: "Arial", minHeight: "100vh" } },
    React.createElement("h1", null, "Estimator App"),
    React.createElement("h2", null, "Employees"),
    ...employees.map((e, idx) =>
      React.createElement("div", { key: idx },
        e.name, " — $", e.rate.toFixed(2), " ",
        React.createElement("button", {
          style: { marginLeft: "1rem" },
          onClick: () => {
            const updated = [...employees];
            updated[idx].salaried = !updated[idx].salaried;
            setEmployees(updated);
          }
        }, e.salaried ? "Salaried" : "Hourly")
      )
    ),
    React.createElement("h2", null, "Hours Worked"),
    ...hoursWorked.map((h, i) =>
      React.createElement("div", { key: i },
        h.type, ": ", h.duration.toFixed(2), "h"
      )
    ),
    React.createElement("h2", null, "Costs"),
    React.createElement("div", null, "Labor Cost: $", laborCost.toFixed(2)),
    React.createElement("div", null, "Drive Cost: $", driveCost.toFixed(2)),
    React.createElement("div", null, "Rental: $", rentalTotal.toFixed(2)),
    React.createElement("div", null, "Travel: $", travelTotal.toFixed(2)),
    React.createElement("div", null, "Per Diem: $", perDiemTotal.toFixed(2)),
    React.createElement("div", null, "Average Expenses: $", averageExpenses.toFixed(2)),
    React.createElement("div", null, "Profit (", profitPercent, "%): $", profit.toFixed(2)),
    React.createElement("h2", null, "Total Job Cost: $", totalCost.toFixed(2))
  );
}
