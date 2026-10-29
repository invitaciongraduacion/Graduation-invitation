
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Conexión con Supabase
const SUPABASE_URL = "https://sqmxtcmmzljhvbtgjffo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_h4KZFTw7pSTscKtK6OLEPA_0rRRyMdE";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// Elementos del formulario
const formulario = document.getElementById("formulario-rsvp");
const campoNombre = document.getElementById("nombre");
const campoPersonas = document.getElementById("personas");
const boton = document.getElementById("boton-confirmar");
const mensaje = document.getElementById("mensaje-estado");

// Mostrar mensajes con su estilo correspondiente
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.classList.remove(
        "mensaje-exito",
        "mensaje-error",
        "mensaje-cargando"
    );

    if (tipo) {
        mensaje.classList.add(tipo);
    }
}

// Comprobar que los elementos del formulario existan
if (!formulario || !campoNombre || !campoPersonas || !boton || !mensaje) {
    console.error(
        "No se encontraron todos los elementos del formulario. " +
        "Revisa los identificadores en index.html."
    );
} else {
    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Evitar envíos repetidos mientras se procesa una solicitud
        if (boton.disabled) return;

        const nombre = campoNombre.value.trim();
        const personas = Number(campoPersonas.value);

        // Limpiar el mensaje anterior
        mostrarMensaje("", "");

        // Validar el nombre
        if (nombre.length < 2 || nombre.length > 100) {
            mostrarMensaje(
                "Por favor, ingresa un nombre de entre 2 y 100 caracteres.",
                "mensaje-error"
            );
            campoNombre.focus();
            return;
        }

        // Validar la cantidad de asistentes
        if (
            !Number.isInteger(personas) ||
            personas < 1 ||
            personas > 10
        ) {
            mostrarMensaje(
                "La cantidad debe estar entre 1 y 10 personas.",
                "mensaje-error"
            );
            campoPersonas.focus();
            return;
        }

        // Mostrar estado de envío
        boton.disabled = true;
        boton.textContent = "ENVIANDO CONFIRMACIÓN...";

        mostrarMensaje(
            "Enviando tus datos, espera un momento...",
            "mensaje-cargando"
        );

        try {
            const { error } = await supabase
                .from("confirmaciones")
                .insert({
                    nombre: nombre,
                    personas: personas,
                    estado: "confirmado"
                });

            if (error) {
                throw error;
            }

            // Confirmación exitosa
            mostrarMensaje(
                "¡Tus datos han sido enviados correctamente! " +
                "Tu asistencia ha quedado registrada. ¡Te esperamos.",
                "mensaje-exito"
            );

            formulario.reset();
            campoPersonas.value = "1";

        } catch (error) {
            console.error("Error al registrar la confirmación:", error);

            // Mensaje de error
            mostrarMensaje(
                "No se pudieron enviar tus datos correctamente. " +
                "Por favor, vuelve a ingresar tus datos e inténtalo nuevamente.",
                "mensaje-error"
            );

        } finally {
            boton.disabled = false;
            boton.innerHTML = "<span>⚽</span> CONFIRMAR ASISTENCIA";
        }
    });
}
