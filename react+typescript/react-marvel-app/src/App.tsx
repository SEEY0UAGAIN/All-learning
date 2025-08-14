import { useState } from "react";
import { Route, Switch } from "wouter";
import "./App.css";

// components
import { Navbar } from "./components/Navbar";
import { Home, Heroes, HeroesDetail } from "./pages";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/heroes" component={Heroes} />
          <Route path="/heroes/:heroName" component={HeroesDetail} />
        </Switch>
      </Navbar>
    </>
  );
}

export default App;
