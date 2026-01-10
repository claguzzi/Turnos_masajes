import { Formik, Form, Field, ErrorMessage } from "formik";
import { turnosSchema } from "../validations/turnosSchema";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

/* 🔹 Horarios hardcodeados */
const HORARIOS = ["19:30", "20:00"];

export default function Home() {
  const navigate = useNavigate();

  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const initialValues = {
    nombre: "claudio",
    telefono: "2222222222",
    email: "claudiolaguzzi@gmail.com",
    fecha: "",
    hora: "",
  };

  /* 📌 Buscar turnos ocupados por fecha */
  const fetchHorariosOcupados = async (fecha) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/turnos?fecha=${fecha}`
      );

      setHorariosOcupados(data.map((t) => t.hora));
    } catch (error) {
      console.error("Error cargando horarios", error);
      setHorariosOcupados([]);
    }
  };

  /* 👀 Cuando cambia la fecha */
  useEffect(() => {
    if (fechaSeleccionada) {
      fetchHorariosOcupados(fechaSeleccionada);
    }
  }, [fechaSeleccionada]);

  /* 📧 Email */
  const enviarEmailConfirmacion = async (turno) => {
    const mensaje = `
Hola ${turno.nombre} 👋

Tu turno fue reservado correctamente ✅

📅 Fecha: ${turno.fecha}
⏰ Hora: ${turno.hora}

Espacio Zen 🌿
`;

    await axios.post("http://localhost:3001/api/email", {
      to: turno.email,
      subject: "Confirmación de turno – Espacio Zen",
      text: mensaje,
    });
  };

  /* 📌 Submit */
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post("http://localhost:3001/api/turnos", values);

      try {
        await enviarEmailConfirmacion(values);
      } catch (error) {
        console.warn("No se pudo enviar el email", error);
      }

      Swal.fire({
        title: "¡Turno reservado!",
        text: "📧 Te enviamos un email con la confirmación",
        icon: "success",
        confirmButtonColor: "#7b6f5b",
      });

      resetForm();
      setHorariosOcupados([]);
      setFechaSeleccionada("");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "No se pudo reservar",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f4efe9] px-4 py-10">
      <button
        onClick={() => navigate("/adminLogin")}
        className="absolute top-4 right-4 px-4 py-2 text-stone-600 hover:text-stone-800"
      >
        Admin
      </button>

      <h1 className="text-3xl font-serif text-stone-800 mb-6">
        Reserva tu turno
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={turnosSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty, setFieldValue, values }) => (
          <Form className="bg-white/70 backdrop-blur p-6 rounded-2xl shadow-xl w-full max-w-md border border-stone-200">

            {/* Nombre */}
            <div className="mb-4">
              <label className="block text-stone-700 font-medium mb-1">
                Nombre completo
              </label>
              <Field
                name="nombre"
                type="text"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#7b6f5b] outline-none"
              />
              <ErrorMessage
                name="nombre"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Teléfono */}
            <div className="mb-4">
              <label className="block text-stone-700 font-medium mb-1">
                Teléfono
              </label>
              <Field
                name="telefono"
                type="tel"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#7b6f5b] outline-none"
              />
              <ErrorMessage
                name="telefono"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-stone-700 font-medium mb-1">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#7b6f5b] outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Fecha */}
            <div className="mb-4">
              <label className="block text-stone-700 font-medium mb-1">
                Fecha
              </label>
              <Field
                type="date"
                name="fecha"
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                onChange={(e) => {
                  setFieldValue("fecha", e.target.value);
                  setFieldValue("hora", "");
                  setFechaSeleccionada(e.target.value);
                }}
              />
              <ErrorMessage
                name="fecha"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Horario */}
            <div className="mb-6">
              <label className="block text-stone-700 font-medium mb-1">
                Horario
              </label>
              <Field
                as="select"
                name="hora"
                disabled={!values.fecha}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              >
                <option value="">Seleccioná horario</option>
                {HORARIOS.map((h) => (
                  <option
                    key={h}
                    value={h}
                    disabled={horariosOcupados.includes(h)}
                  >
                    {h} {horariosOcupados.includes(h) ? "⛔ Ocupado" : ""}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="hora"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={!isValid || !dirty}
              className={`w-full py-3 rounded-full font-medium transition ${
                !isValid || !dirty
                  ? "bg-stone-300 cursor-not-allowed"
                  : "bg-[#7b6f5b] hover:bg-[#6a5f4d] text-white"
              }`}
            >
              Confirmar turno
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
