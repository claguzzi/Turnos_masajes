import { Formik, Form, Field, ErrorMessage } from "formik";
import { turnosSchema } from "../validations/turnosSchema";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useEffect, useState } from "react";

/* 🔹 Horarios hardcodeados */
const HORARIOS = ["19:30", "20:30"];

/* 🔹 Fechas permitidas (hoy → 1 mes) */
const getFechaLocal = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

const hoy = new Date();
const fechaMaxima = new Date();
fechaMaxima.setMonth(hoy.getMonth() + 1);

const minFecha = getFechaLocal(hoy);
const maxFecha = getFechaLocal(fechaMaxima);

export default function Home() {
  const navigate = useNavigate();

  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [enviandoTurno, setEnviandoTurno] = useState(false);

  const initialValues = {
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
  };

  /* 📌 Buscar horarios ocupados */
  const fetchHorariosOcupados = async (fecha) => {
    setCargandoHorarios(true);
    try {
      const { data } = await api.get(`/turnos?fecha=${encodeURIComponent(fecha)}`);
      setHorariosOcupados(data.map((t) => t.hora));
    } catch (error) {
      console.error("Error cargando horarios", error);
      setHorariosOcupados([]);
    } finally {
      setCargandoHorarios(false);
    }
  };

  /* 👀 Cuando cambia la fecha */
  useEffect(() => {
    if (fechaSeleccionada) {
      setHorariosOcupados([]);
      fetchHorariosOcupados(fechaSeleccionada);
    }
  }, [fechaSeleccionada]);

  /* 📧 Email confirmación */
  const _enviarEmailConfirmacion = async (turno) => {
    const mensaje = `
Hola ${turno.nombre} 👋

Tu turno fue reservado correctamente ✅

📅 Fecha: ${turno.fecha}
⏰ Hora: ${turno.hora}

Espacio Zen 🌿
`;

    await api.post("/email", {
      to: turno.email,
      subject: "Confirmación de turno – Espacio Zen",
      text: mensaje,
    });
  };

  /* 🚫 SUBMIT BLOQUEADO A UN SOLO CLICK */
  const handleSubmit = async (values, { resetForm }) => {
    if (enviandoTurno) return;

    if (horariosOcupados.includes(values.hora)) {
      Swal.fire(
        "Horario no disponible",
        "Ese horario ya fue reservado. Elegí otro 🙏",
        "warning"
      );
      return;
    }

    setEnviandoTurno(true);

    try {
      await api.post("/turnos", values);

      Swal.fire({
        title: "¡Turno reservado!",
        text: "Tu turno fue reservado correctamente, se envio una confirmación a tu email 📧",
        icon: "success",
        confirmButtonColor: "#7b6f5b",
      });

      resetForm();
      setFechaSeleccionada("");
      setHorariosOcupados([]);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "No se pudo reservar",
        "error"
      );
    } finally {
      setEnviandoTurno(false);
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
        {({ isValid, setFieldValue, values }) => (
          <Form className="bg-white/70 backdrop-blur p-6 rounded-2xl shadow-xl w-full max-w-md border border-stone-200">
            
            {/* Nombre */}
            <div className="mb-4">
              <label className="block text-stone-700 font-medium mb-1">
                Nombre completo
              </label>
              <Field
                name="nombre"
                className="w-full px-3 py-2 border rounded-lg"
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
                className="w-full px-3 py-2 border rounded-lg"
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
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded-lg"
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
                min={minFecha}
                max={maxFecha}
                className="w-full px-3 py-2 border rounded-lg"
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
                disabled={!values.fecha || cargandoHorarios}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">
                  {cargandoHorarios
                    ? "Cargando horarios..."
                    : "Seleccioná horario"}
                </option>

                {HORARIOS
                  .filter((h) => !horariosOcupados.includes(h))
                  .map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
              </Field>

              {!cargandoHorarios &&
                HORARIOS.filter((h) => !horariosOcupados.includes(h)).length ===
                  0 && (
                  <p className="text-sm text-red-500 mt-1">
                    No hay horarios disponibles para este día, elegí otro.
                  </p>
                )}

              <ErrorMessage
                name="hora"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={!isValid || !values.hora || enviandoTurno}
              className={`w-full py-3 rounded-full font-medium transition ${
                !isValid || !values.hora || enviandoTurno
                  ? "bg-stone-300 cursor-not-allowed"
                  : "bg-[#7b6f5b] hover:bg-[#6a5f4d] text-white"
              }`}
            >
              {enviandoTurno ? "Reservando..." : "Confirmar turno"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
