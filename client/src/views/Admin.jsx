import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

/* 🔹 Color por estado */
const estadoClase = (estado) => {
  switch (estado) {
    case "confirmado":
    case "realizado":
      return "text-green-700 font-bold";
    case "cancelado":
      return "text-red-700 font-bold";
    case "bloqueado":
      return "text-red-500 font-bold line-through opacity-50";
    default:
      return "text-yellow-700 font-bold";
  }
};

/* 🔹 Recordatorio habilitado desde 3 días antes */
const habilitarRecordatorio = (fecha) => {
  if (!fecha) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaTurno = new Date(fecha);
  fechaTurno.setHours(0, 0, 0, 0);

  const diferenciaDias =
    (fechaTurno - hoy) / (1000 * 60 * 60 * 24);

  return diferenciaDias >= 0 && diferenciaDias <= 3;
};

/* 🔹 WhatsApp */
const enviarRecordatorioWhatsApp = (turno) => {
  const mensaje = `Hola ${turno.nombre} 😊
Te recordamos tu turno de masajes

📅 ${turno.fecha}
⏰ ${turno.hora}
📍 Te esperamos`;

  const telefono = turno.telefono.replace(/\D/g, "");
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
};

export default function Admin() {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 Edición de estado */
  const [editEstadoId, setEditEstadoId] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  /* 🔹 Paginado */
  const [paginaActual, setPaginaActual] = useState(1);
  const TURNOS_POR_PAGINA = 8;

  const indiceUltimo = paginaActual * TURNOS_POR_PAGINA;
  const indicePrimero = indiceUltimo - TURNOS_POR_PAGINA;
  const turnosPaginados = turnos.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(turnos.length / TURNOS_POR_PAGINA);

  /* 🔐 Logout */
  const cerrarSesion = () => {
    localStorage.removeItem("isAdmin");
    navigate("/home");
  };

  const fetchTurnos = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/turnos");
      setTurnos(data);
      setPaginaActual(1);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los turnos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const eliminarTurno = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar turno?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3001/api/turnos/${id}`);
      fetchTurnos();
      Swal.fire("Eliminado", "Turno eliminado", "success");
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const iniciarEdicionEstado = (turno) => {
    setEditEstadoId(turno.id);
    setNuevoEstado(turno.estado);
  };

  const guardarEstado = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/turnos/${id}`, {
        estado: nuevoEstado,
      });
      setEditEstadoId(null);
      fetchTurnos();
      Swal.fire("OK", "Estado actualizado", "success");
    } catch {
      Swal.fire("Error", "No se pudo actualizar el estado", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efe9]">
        Cargando turnos...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-[#f4efe9]">
      {/* HEADER */}
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
        <h1 className="text-xl font-bold">Panel de Administración</h1>
        <button
          onClick={cerrarSesion}
          className="px-4 py-2 bg-stone-200 rounded-full"
        >
          Cerrar sesión
        </button>
      </header>

      {/* MOBILE */}
      <div className="sm:hidden mt-4 space-y-4">
        {turnosPaginados.map((turno) => (
          <div key={turno.id} className="bg-white p-4 rounded-xl shadow">
            <p className="font-semibold">{turno.nombre}</p>
            <p>{turno.telefono}</p>
            <p>{turno.email}</p>
            <p className="mt-1">
              📅 {turno.fecha} ⏰ {turno.hora}
            </p>

            {editEstadoId === turno.id ? (
              <>
                <select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  className="w-full mt-2 border rounded px-2 py-1"
                >
                  <option value="pendiente">pendiente</option>
                  <option value="confirmado">confirmado</option>
                  <option value="realizado">realizado</option>
                  <option value="cancelado">cancelado</option>
                  <option value="bloqueado">bloqueado</option>
                </select>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => guardarEstado(turno.id)}
                    className="flex-1 bg-[#7b6f5b] text-white py-2 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditEstadoId(null)}
                    className="flex-1 bg-stone-200 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className={estadoClase(turno.estado)}>{turno.estado}</p>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => iniciarEdicionEstado(turno)}
                    className="bg-stone-200 py-2 rounded"
                  >
                    Editar estado
                  </button>

                  {habilitarRecordatorio(turno.fecha) &&
                    turno.estado !== "cancelado" && (
                      <button
                        onClick={() => enviarRecordatorioWhatsApp(turno)}
                        className="bg-green-600 text-white py-2 rounded"
                      >
                        📲 Recordatorio
                      </button>
                    )}
                </div>

                <button
                  onClick={() => eliminarTurno(turno.id)}
                  className="w-full mt-2 bg-red-100 text-red-700 py-2 rounded"
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:block mt-6 bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-200">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Hora</th>
              <th className="p-2 text-left">Estado</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosPaginados.map((turno) => (
              <tr key={turno.id} className="border-t">
                <td className="p-2">{turno.nombre}</td>
                <td className="p-2">{turno.fecha}</td>
                <td className="p-2">{turno.hora}</td>

                <td className="p-2">
                  {editEstadoId === turno.id ? (
                    <select
                      value={nuevoEstado}
                      onChange={(e) => setNuevoEstado(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pendiente">pendiente</option>
                      <option value="confirmado">confirmado</option>
                      <option value="realizado">realizado</option>
                      <option value="cancelado">cancelado</option>
                      <option value="bloqueado">bloqueado</option>
                    </select>
                  ) : (
                    <span className={estadoClase(turno.estado)}>
                      {turno.estado}
                    </span>
                  )}
                </td>

                <td className="p-2 flex gap-2 justify-center">
                  {editEstadoId === turno.id ? (
                    <>
                      <button
                        onClick={() => guardarEstado(turno.id)}
                        className="px-3 py-1 bg-[#7b6f5b] text-white rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditEstadoId(null)}
                        className="px-3 py-1 bg-stone-200 rounded"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => iniciarEdicionEstado(turno)}
                        className="px-3 py-1 bg-stone-200 rounded"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => enviarRecordatorioWhatsApp(turno)}
                        disabled={
                          !habilitarRecordatorio(turno.fecha) ||
                          turno.estado === "cancelado"
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-40"
                      >
                        📲
                      </button>

                      <button
                        onClick={() => eliminarTurno(turno.id)}
                        className="px-3 py-1 bg-red-300 text-red-900 rounded"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINADO */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className="px-4 py-2 bg-stone-200 rounded disabled:opacity-50"
          >
            ← Anterior
          </button>

          <span className="font-semibold">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={() =>
              setPaginaActual((p) => Math.min(p + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-stone-200 rounded disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}