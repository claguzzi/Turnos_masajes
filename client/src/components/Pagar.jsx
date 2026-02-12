import React, { useState } from "react";
import axios from "axios";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

/* 🔐 Inicializar Mercado Pago una sola vez */
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);



export default function Pagar({ turnoId }) {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PRICE = 10; // Precio fijo de la seña

  const createPreference = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/pago/create_preference",
        {
          turnoId: turnoId, // Enviar el turnoId al backend
          description: "Seña turno de masajes",
          price: PRICE,
          quantity: 1,
        }
      );

      return response.data.preferenceId;
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar el pago. Intentá nuevamente.");
      return null;
    }
  };

  const handlePagarSenia = async () => {
    setError(null);
    setLoading(true);

    const id = await createPreference();
    if (id) setPreferenceId(id);

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mt-6">
      <div className="bg-white/70 backdrop-blur shadow-lg rounded-2xl p-6 border border-stone-200 text-center">

        <h2 className="text-lg font-medium text-stone-700 mb-3">
          Seña para tu turno
        </h2>

        <p className="text-stone-600 mb-4">
          Para asegurar tu turno, solicitamos una seña.
        </p>

        <p className="text-stone-700 mb-6">
          Monto:
          <span className="block text-2xl font-serif font-semibold mt-1">
            ${PRICE}
          </span>
        </p>

        {!preferenceId && (
          <button
            onClick={handlePagarSenia}
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#7b6f5b] text-white font-medium hover:bg-[#6a5f4d] transition disabled:opacity-50"
          >
            {loading ? "Preparando pago..." : "Pagar seña"}
          </button>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-3">
            {error}
          </p>
        )}

        {preferenceId && (
          <div className="mt-6 border-t border-stone-300 pt-6">
            <Wallet initialization={{ preferenceId }} />
          </div>
        )}
      </div>
    </div>
  );
}
