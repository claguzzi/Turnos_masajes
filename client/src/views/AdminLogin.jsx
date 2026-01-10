import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    const { username, password } = values;

    // Validación simple
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completá usuario y contraseña",
        confirmButtonColor: "#f9a8d4",
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/user/login",
        { username, password }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Acceso concedido al panel de administración",
          confirmButtonColor: "#f9a8d4",
        });

        navigate("/admin");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Credenciales inválidas o error de servidor";

      Swal.fire({
        icon: "error",
        title: "Error de login",
        text: msg,
        confirmButtonColor: "#f87171",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50 to-rose-100 px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-rose-700 mb-6 text-center">
        Panel de Admin
      </h1>

      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white shadow-md rounded-xl p-6 w-full max-w-md border border-rose-100">
            {/* Usuario */}
            <div className="mb-4">
              <label className="block text-rose-600 mb-2 font-medium">
                Usuario
              </label>
              <Field
                type="text"
                name="username"
                placeholder="admin"
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            {/* Contraseña */}
            <div className="mb-6">
              <label className="block text-rose-600 mb-2 font-medium">
                Contraseña
              </label>
              <Field
                type="password"
                name="password"
                placeholder="********"
                className="w-full px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 font-medium rounded-lg shadow transition ${
                isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-rose-300 text-rose-900 hover:bg-rose-400"
              }`}
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
