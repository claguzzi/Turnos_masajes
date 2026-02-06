import { Home, Landing, Admin, AdminLogin, Success, Failure } from "./views";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";






function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/home" element={<Home />} />

        <Route path="/adminLogin" element={<AdminLogin />} />

        <Route path="/success" element={<Success />} />

        <Route path="/failure" element={<Failure />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        

      </Routes>

    </div>
  );
}

export default App;
