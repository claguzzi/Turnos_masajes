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
        confirmButtonColor: "#7b6f5b",
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
          confirmButtonColor: "#7b6f5b",
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
        confirmButtonColor: "#b45309",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4efe9] px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-serif text-stone-800 mb-8 text-center">
        Panel de Administración
      </h1>

      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white/70 backdrop-blur shadow-xl rounded-2xl p-8 w-full max-w-md border border-stone-200">

            {/* Usuario */}
            <div className="mb-6">
              <label className="block text-stone-700 mb-2 font-medium">
                Usuario
              </label>
              <Field
                type="text"
                name="username"
                placeholder="admin"
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7b6f5b]"
              />
            </div>

            {/* Contraseña */}
            <div className="mb-8">
              <label className="block text-stone-700 mb-2 font-medium">
                Contraseña
              </label>
              <Field
                type="password"
                name="password"
                placeholder="********"
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7b6f5b]"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 font-medium rounded-full shadow transition ${
                isSubmitting
                  ? "bg-stone-300 cursor-not-allowed"
                  : "bg-[#7b6f5b] text-white hover:bg-[#6a5f4d]"
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
