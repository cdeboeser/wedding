import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Invitation from "./Invitation";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path=":inviteCode" element={<Invitation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
