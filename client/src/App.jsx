import { Home, Landing, Admin, AdminLogin, Success, Failure } from "./views";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import SuccessRoute from "./components/SuccessRoute";





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

        {/* <Route
          path="/success"
          element={
            <SuccessRoute>
              <Success />
            </SuccessRoute>
          }
        /> */}

      </Routes>

    </div>
  );
}

export default App;
