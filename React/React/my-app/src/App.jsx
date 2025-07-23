import { useState, useEffect, use } from "react";
import Header from "./components/Header";
import PersionList from "./components/PersonList";
import AddFrom from "./components/addFrom";
import "./App.css";
function App() {
  const [data, setData] = useState([
    { id: 1, name: "John", gender: "ชาย" },
    { id: 2, name: "Jane", gender: "หญิง" },
    { id: 3, name: "Doe", gender: "ชาย" },
    { id: 4, name: "Doe", gender: "หญิง" },
  ]);

  const [theme, setTheme] = useState(localStorage.getItem("mode") || "light");

  function deleteUser(id) {
    const result = data.filter((user) => user.id !== id); // array ใหม่ที่ไม่มี id ที่ต้องการลบ
    setData(result);
  }

  useEffect(() => {
    localStorage.setItem("mode", theme);
  }, [theme]);

  return (
    <div className={theme}>
      <div className="App">
        <Header title="MY APP" theme={theme} setTheme={setTheme} />
        <main>
          <AddFrom data={data} setData={setData} />
          <PersionList data={data} deleteUser={deleteUser} />
        </main>
      </div>
    </div>
  );
}

export default App;
