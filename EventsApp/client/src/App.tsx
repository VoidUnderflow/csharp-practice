import { useEffect, useState } from "react";
import "./App.css";
import type { Activity } from "./lib/types";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("http://localhost:5200/api/activities")
      .then((response) => response.json())
      .then((data) => setActivities(data));
  }, []);

  return (
    <div>
      <h3 className="app" style={{ color: "red" }}>
        EventsApp
      </h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>{activity.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
