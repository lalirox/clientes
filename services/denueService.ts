
import type { Company } from '../types';

const BASE_URL_NOMBRE = "https://www.inegi.org.mx/app/api/denue/v1/consulta/Nombre";
const BASE_URL_BUSCAR = "https://www.inegi.org.mx/app/api/denue/v1/consulta/buscar";

const estratoToTamanio = (estrato: string): string => {
    const e = (estrato || "").toLowerCase().trim();
    if (e.includes("0 a 10") || e.includes("6 a") || e.includes("de 0") || e.includes("0-5")) {
        return "Micro";
    }
    if (e.includes("11 a") || e.includes("15 a") || e.includes("20 a") || e.includes("25 a") || e.includes("31 a") || e.includes("50 a")) {
        return "Pequeña";
    }
    if (e.includes("51 a") || e.includes("100 a") || e.includes("200 a") || e.includes("251 a")) {
        return "Mediana";
    }
    if (e.includes("251 y más") || e.includes("+")) {
        return "Grande";
    }
    return "Desconocido";
};

const parseApiResponse = (data: any[], source: string): Company[] => {
    if (!Array.isArray(data)) {
        return [];
    }
    return data.map(est => ({
        nombre: (est.Nombre || est.raz_social || est.Razon_social || "").trim(),
        giro: (est.Clase_actividad || est.Clase_act || "").trim(),
        tamanio: estratoToTamanio(est.Estrato || ""),
        telefono: est.Telefono || est.Tel || null,
        correo: est.Correo_e || null,
        sitio_web: est.Sitio_internet || null,
        estado: (est.Entidad || est.Entidad_federativa || "").trim(),
        ciudad: (est.Municipio || "").trim(),
        fuente: source,
    }));
};

const fetchData = async (url: string): Promise<any> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // INEGI API sometimes returns error details in JSON, try to parse it
            let errorBody;
            try {
                errorBody = await response.json();
            } catch (jsonError) {
                // Not a json error, use status text
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
            const errorMessage = errorBody?.message || `API Error: ${response.status}`;
            throw new Error(errorMessage);
        }
        return response.json();
    } catch (error) {
        if (error instanceof Error) {
            // Re-throw to be caught by the caller
            throw new Error(`Network error or failed request: ${error.message}`);
        }
        throw new Error('An unexpected error occurred during the API request.');
    }
};

export const searchByName = async (token: string, condition: string, stateKey: string): Promise<Company[]> => {
    const url = `${BASE_URL_NOMBRE}/${encodeURIComponent(condition)}/${stateKey}/1/1000/${token}`;
    const data = await fetchData(url);
    return parseApiResponse(data, 'DENUE (Nombre)');
};

export const searchByRadius = async (token: string, condition: string, lat: number, lon: number, meters: number): Promise<Company[]> => {
    const safeMeters = Math.min(meters, 5000); // API limit
    const url = `${BASE_URL_BUSCAR}/${encodeURIComponent(condition)}/${lat},${lon}/${safeMeters}/${token}`;
    const data = await fetchData(url);
    return parseApiResponse(data, 'DENUE (Radio)');
};
