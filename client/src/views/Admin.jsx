import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

/* 🔹 Helper para color de estado */
const estadoClase = (estado) => {
  switch (estado) {
    case "confirmado":
    case "realizado":
      return "text-green-600 font-bold";
    case "cancelado":
      return "text-red-600 font-bold";
    default:
      return "text-yellow-600 font-bold"; // pendiente
  }
};

export default function Admin() {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  // edición
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    fecha: "",
    hora: "",
    estado: "",
  });

  /* ================== CERRAR SESIÓN ================== */
  const cerrarSesion = () => {
     navigate("/adminLogin");
  };

  /* ================== FETCH ================== */
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

  /* ================== ELIMINAR ================== */
  const eliminarTurno = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar turno?",
      text: "⚠️ Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f87171",
      cancelButtonColor: "#9ca3af",
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

  /* ================== EDITAR ================== */
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
      Swal.fire(
        "Actualizado",
        "Turno actualizado correctamente",
        "success"
      );
    } catch {
      Swal.fire("Error", "No se pudo actualizar el turno", "error");
    }
  };

  /* ================== LOADING ================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <p className="text-pink-700 font-medium">Cargando turnos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-3 sm:p-6">
      {/* Header */}
      <header className="bg-pink-100 shadow-md p-4 rounded-xl flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-pink-800">
          Panel de Administración
        </h1>

        <button
          onClick={cerrarSesion}
          className="px-4 py-2 bg-red-200 text-red-900 rounded-lg hover:bg-red-300 transition"
        >
          Cerrar sesión
        </button>
      </header>

      {/* ================= MOBILE ================= */}
      <div className="mt-4 space-y-4 sm:hidden">
        {turnos.length === 0 && (
          <p className="text-center text-gray-500">No hay turnos</p>
        )}

        {turnos.map((turno) => (
          <div
            key={turno.id}
            className="bg-white rounded-xl shadow p-4 border border-pink-100"
          >
            <p className="font-semibold text-pink-700">{turno.nombre}</p>
            <p className="text-sm text-gray-600">{turno.telefono}</p>
            <p className="text-sm text-gray-600">{turno.email}</p>

            {editId === turno.id ? (
              <>
                <input
                  type="date"
                  value={editData.fecha}
                  onChange={(e) =>
                    setEditData({ ...editData, fecha: e.target.value })
                  }
                  className="w-full mt-2 border rounded px-2 py-1"
                />

                <input
                  type="time"
                  value={editData.hora}
                  onChange={(e) =>
                    setEditData({ ...editData, hora: e.target.value })
                  }
                  className="w-full mt-2 border rounded px-2 py-1"
                />

                <select
                  value={editData.estado}
                  onChange={(e) =>
                    setEditData({ ...editData, estado: e.target.value })
                  }
                  className="w-full mt-2 border rounded px-2 py-1"
                >
                  <option value="pendiente">pendiente</option>
                  <option value="confirmado">confirmado</option>
                  <option value="realizado">realizado</option>
                  <option value="cancelado">cancelado</option>
                </select>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => guardarEdicion(turno.id)}
                    className="flex-1 py-2 bg-green-200 text-green-900 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex-1 py-2 bg-gray-200 rounded"
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
                    className="flex-1 py-2 bg-yellow-200 text-yellow-900 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarTurno(turno.id)}
                    className="flex-1 py-2 bg-red-200 text-red-900 rounded"
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
      <div className="hidden sm:block mt-6 bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-pink-200 text-pink-900">
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
              <tr key={turno.id} className="border-b hover:bg-pink-50">
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
                        className="border rounded px-2 py-1"
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
                        className="border rounded px-2 py-1"
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
                        className="border rounded px-2 py-1"
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
                        className="px-3 py-1 bg-green-200 rounded"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 bg-gray-200 rounded"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{turno.fecha}</td>
                    <td className="p-3">{turno.hora}</td>
                    <td className={`p-3 capitalize ${estadoClase(turno.estado)}`}>
                      {turno.estado}
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => iniciarEdicion(turno)}
                        className="px-3 py-1 bg-yellow-200 rounded"
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
