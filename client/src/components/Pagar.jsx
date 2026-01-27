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
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md text-center">
        <h2 className="text-xl font-semibold text-pink-700 mb-4">
          Seña para tu turno de masajes
        </h2>

        <p className="mb-6 text-gray-700">Monto: ${PRICE}</p>

        {/* 👉 BOTÓN PROPIO: solo antes de crear la preferencia */}
        {!preferenceId && (
          <button
            onClick={handlePagarSenia}
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generando pago..." : "Pagar"}
          </button>
        )}

        {error && <p className="text-red-600 mt-4">{error}</p>}

        {/* 👉 BOTÓN DE MERCADO PAGO: solo después */}
        {preferenceId && (
          <div className="mt-6">
            <Wallet
              key={preferenceId}
              initialization={{ preferenceId }}
            />
          </div>
        )}
      </div>
    );
  }