// --- Configuración de la API ---
// Reemplaza la siguiente clave por tu propia API Key de TMDB.
// Puedes obtenerla gratis en: https://www.themoviedb.org/settings/api
const API_KEY = "COLOCA_AQUI_TU_API_KEY";

const URL_BASE = "https://api.themoviedb.org/3";
const URL_IMAGENES = "https://image.tmdb.org/t/p/w500";

// --- Eventos ---
$(document).ready(function () {

    // Buscar al hacer clic en el botón
    $("#btnBuscar").on("click", function () {
        buscar();
    });

    // Buscar al presionar Enter dentro del campo de texto
    $("#txtBusqueda").on("keypress", function (evento) {
        if (evento.which === 13) {
            buscar();
        }
    });

});

// --- Función principal de búsqueda ---
function buscar() {

    const texto = $("#txtBusqueda").val().trim();

    // Validación simple
    if (texto === "") {
        $("#mensaje").text("Por favor, escribe el nombre de una película o serie.");
        $("#resultados").empty();
        return;
    }

    // Limpiar resultados anteriores y avisar que está cargando
    $("#resultados").empty();
    $("#mensaje").text("Buscando...");

    // Petición AJAX con jQuery a la API de TMDB
    $.ajax({
        url: URL_BASE + "/search/multi",
        method: "GET",
        data: {
            api_key: API_KEY,
            query: texto,
            language: "es-ES"
        },
        success: function (respuesta) {
            mostrarResultados(respuesta.results);
        },
        error: function () {
            $("#mensaje").text("Ocurrió un error al conectar con la API. Verifica tu API Key.");
        }
    });

}

// --- Función que dibuja las cards en el HTML ---
function mostrarResultados(peliculas) {

    // Si no hay resultados
    if (!peliculas || peliculas.length === 0) {
        $("#mensaje").text("No se encontraron resultados.");
        return;
    }

    // Quitar el mensaje de estado
    $("#mensaje").text("");

    // Recorrer cada resultado y crear su card
    peliculas.forEach(function (item) {

        // El título puede venir como "title" (películas) o "name" (series)
        const titulo = item.title || item.name || "Sin título";

        // La fecha puede venir como "release_date" o "first_air_date"
        const fecha = item.release_date || item.first_air_date || "Fecha desconocida";

        // Descripción
        const descripcion = item.overview
            ? item.overview
            : "Sin descripción disponible.";

        // Puntuación
        const puntuacion = item.vote_average
            ? item.vote_average.toFixed(1)
            : "N/D";

        // Imagen del póster (si no tiene, usamos una imagen genérica)
        const poster = item.poster_path
            ? URL_IMAGENES + item.poster_path
            : "https://via.placeholder.com/500x750?text=Sin+imagen";

        // Plantilla HTML de la card
        const card = `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <img src="${poster}" class="card-img-top" alt="${titulo}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${titulo}</h5>
                        <p class="card-text text-muted small mb-1">Estreno: ${fecha}</p>
                        <p class="card-text descripcion">${descripcion}</p>
                        <span class="badge bg-warning text-dark mt-auto align-self-start">
                            Puntuación: ${puntuacion}
                        </span>
                    </div>
                </div>
            </div>
        `;

        // Agregar la card al contenedor de resultados
        $("#resultados").append(card);

    });

}
