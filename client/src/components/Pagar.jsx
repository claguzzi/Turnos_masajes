import React, { useState } from "react";
import axios from "axios";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

/* 🔐 Inicializar Mercado Pago una sola vez */
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);

export default function Pagar() {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PRICE = 10; // Precio fijo de la seña

  const createPreference = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/pago/create_preference",
        {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4efe9] px-4 py-10 text-center">

      <div className="bg-white/70 backdrop-blur shadow-lg rounded-2xl p-8 w-full max-w-md border border-stone-200">

        <h2 className="text-xl font-medium text-stone-700 mb-4">
          Seña para tu turno de masajes
        </h2>

        <p className="text-stone-600 mb-6 leading-relaxed">
          Para asegurar tu turno, solicitamos una seña.
        </p>

        <p className="text-stone-700 mb-8">
          Monto:
          <span className="block text-3xl font-serif font-semibold mt-2">
            ${PRICE}
          </span>
        </p>

        {/* Botón propio */}
        {!preferenceId && (
          <button
            onClick={handlePagarSenia}
            disabled={loading}
            className="w-full px-10 py-3 rounded-full bg-[#7b6f5b] text-white font-medium shadow-lg hover:bg-[#6a5f4d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Preparando pago..." : "Pagar seña"}
          </button>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-4">
            {error}
          </p>
        )}

        {/* Mercado Pago */}
        {preferenceId && (
          <div className="mt-6 border-t border-stone-300 pt-6">
            <Wallet
              key={preferenceId}
              initialization={{ preferenceId }}
            />
          </div>
        )}
      </div>
    </div>
  );
}