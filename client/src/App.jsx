import { Home, Landing, Admin, AdminLogin, Success } from "./views";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import SuccessRoute from "./components/SuccessRoute";





function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/home" element={<Home />} />



        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/success"
          element={
            <SuccessRoute>
              <Success />
            </SuccessRoute>
          }
        />



        <Route path="/adminLogin" element={<AdminLogin />} />

      </Routes>
    </div>
  );
}

export default App;
