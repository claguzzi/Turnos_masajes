import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

/* 🔹 Helper para color de estado */
const estadoClase = (estado) => {
  switch (estado) {
    case "confirmado":
    case "realizado":
      return "text-green-700 font-bold";
    case "cancelado":
      return "text-red-700 font-bold";
    default:
      return "text-yellow-700 font-bold";
  }
};

export default function Admin() {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    fecha: "",
    hora: "",
    estado: "",
  });

  // 🔐 LOGOUT CORRECTO
  const cerrarSesion = () => {
    localStorage.removeItem("isAdmin");
    navigate("/adminLogin");
  };

  const fetchTurnos = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/turnos");
      setTurnos(data);
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
      confirmButtonColor: "#b45309",
      cancelButtonColor: "#a8a29e",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3001/api/turnos/${id}`);
      fetchTurnos();
      Swal.fire("Eliminado", "El turno fue eliminado", "success");
    } catch {
      Swal.fire("Error", "No se pudo eliminar el turno", "error");
    }
  };

  const iniciarEdicion = (turno) => {
    setEditId(turno.id);
    setEditData({
      fecha: turno.fecha,
      hora: turno.hora,
      estado: turno.estado,
    });
  };

  const guardarEdicion = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/turnos/${id}`, editData);
      setEditId(null);
      fetchTurnos();
      Swal.fire("Actualizado", "Turno actualizado", "success");
    } catch {
      Swal.fire("Error", "No se pudo actualizar el turno", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4efe9]">
        <p className="text-stone-600">Cargando turnos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efe9] p-3 sm:p-6">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur shadow-md p-4 rounded-2xl flex justify-between items-center border border-stone-200">
        <h1 className="text-xl sm:text-2xl font-serif text-stone-800">
          Panel de Administración
        </h1>

        <button
          onClick={cerrarSesion}
          className="px-4 py-2 bg-stone-200 text-stone-800 rounded-full hover:bg-stone-300 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* ================= MOBILE ================= */}
      <div className="mt-4 space-y-4 sm:hidden">
        {turnos.map((turno) => (
          <div
            key={turno.id}
            className="bg-white/70 backdrop-blur rounded-2xl shadow p-4 border border-stone-200"
          >
            <p className="font-semibold text-stone-800">{turno.nombre}</p>
            <p className="text-sm text-stone-500">{turno.telefono}</p>
            <p className="text-sm text-stone-500">{turno.email}</p>

            {editId === turno.id ? (
              <>
                <input
                  type="date"
                  value={editData.fecha}
                  onChange={(e) =>
                    setEditData({ ...editData, fecha: e.target.value })
                  }
                  className="w-full mt-2 border border-stone-300 rounded px-2 py-1"
                />

                <input
                  type="time"
                  value={editData.hora}
                  onChange={(e) =>
                    setEditData({ ...editData, hora: e.target.value })
                  }
                  className="w-full mt-2 border border-stone-300 rounded px-2 py-1"
                />

                <select
                  value={editData.estado}
                  onChange={(e) =>
                    setEditData({ ...editData, estado: e.target.value })
                  }
                  className="w-full mt-2 border border-stone-300 rounded px-2 py-1"
                >
                  <option value="pendiente">pendiente</option>
                  <option value="confirmado">confirmado</option>
                  <option value="realizado">realizado</option>
                  <option value="cancelado">cancelado</option>
                </select>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => guardarEdicion(turno.id)}
                    className="flex-1 py-2 bg-[#7b6f5b] text-white rounded-full"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex-1 py-2 bg-stone-200 rounded-full"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm mt-1">
                  📅 {turno.fecha} ⏰ {turno.hora}
                </p>
                <p className="text-sm mt-1">
                  Estado:{" "}
                  <span className={`capitalize ${estadoClase(turno.estado)}`}>
                    {turno.estado}
                  </span>
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => iniciarEdicion(turno)}
                    className="flex-1 py-2 bg-stone-200 rounded-full"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarTurno(turno.id)}
                    className="flex-1 py-2 bg-red-200 rounded-full"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden sm:block mt-6 bg-white/70 backdrop-blur shadow-xl rounded-2xl overflow-x-auto border border-stone-200">
        <table className="w-full text-sm">
          <thead className="bg-stone-200 text-stone-800">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Teléfono</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Hora</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr
                key={turno.id}
                className="border-b border-stone-200 hover:bg-stone-50"
              >
                <td className="p-3">{turno.nombre}</td>
                <td className="p-3">{turno.telefono}</td>
                <td className="p-3">{turno.email}</td>

                {editId === turno.id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="date"
                        value={editData.fecha}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            fecha: e.target.value,
                          })
                        }
                        className="border border-stone-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="time"
                        value={editData.hora}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            hora: e.target.value,
                          })
                        }
                        className="border border-stone-300 rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={editData.estado}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            estado: e.target.value,
                          })
                        }
                        className="border border-stone-300 rounded px-2 py-1"
                      >
                        <option value="pendiente">pendiente</option>
                        <option value="confirmado">confirmado</option>
                        <option value="realizado">realizado</option>
                        <option value="cancelado">cancelado</option>
                      </select>
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => guardarEdicion(turno.id)}
                        className="px-3 py-1 bg-[#7b6f5b] text-white rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-stone-200 rounded"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{turno.fecha}</td>
                    <td className="p-3">{turno.hora}</td>
                    <td
                      className={`p-3 capitalize ${estadoClase(
                        turno.estado
                      )}`}
                    >
                      {turno.estado}
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => iniciarEdicion(turno)}
                        className="px-3 py-1 bg-stone-200 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarTurno(turno.id)}
                        className="px-3 py-1 bg-red-200 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
