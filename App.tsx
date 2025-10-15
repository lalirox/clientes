import React, { useState, useCallback } from 'react';
import { SearchForm } from './components/SearchForm';
import { ResultsTable } from './components/ResultsTable';
import { LoadingSpinner, InfoIcon, ErrorIcon } from './components/icons';
import type { Company } from './types';
import type { SearchParams } from './components/SearchForm';
import { searchByName, searchByRadius } from './services/denueService';
import { exportToCsv } from './utils/csvExporter';

const App: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

    const handleSearch = useCallback(async (params: SearchParams) => {
        setIsLoading(true);
        setError(null);
        setCompanies([]);
        setSearchPerformed(true);

        try {
            let results: Company[] = [];
            const keywords = params.keywords.split(',').map(k => k.trim()).filter(Boolean);
            const sizes = new Set<string>();
            if (params.isMedium) sizes.add("Mediana");
            if (params.isLarge) sizes.add("Grande");

            if (params.latitude && params.longitude && params.radius) {
                // Search by radius
                const searchPromises = keywords.map(keyword => 
                    searchByRadius(params.token, keyword, params.latitude!, params.longitude!, params.radius!)
                );
                const resultsByKeyword = await Promise.all(searchPromises);
                results = resultsByKeyword.flat();

            } else {
                // Search by name/keyword
                const states = params.states.split(',').map(s => s.trim()).filter(Boolean);
                const statesToSearch = states.length > 0 ? states : ["00"]; // "00" for national
                
                const searchCombinations: { keyword: string, state: string }[] = [];
                keywords.forEach(keyword => {
                    statesToSearch.forEach(state => {
                        searchCombinations.push({ keyword, state });
                    });
                });

                const searchPromises = searchCombinations.map(combo => 
                    searchByName(params.token, combo.keyword, combo.state)
                );
                const resultsByCombination = await Promise.all(searchPromises);
                results = resultsByCombination.flat();
            }

            // Remove duplicates based on a composite key and filter by size
            const uniqueResults = Array.from(new Map(results.map(c => [`${c.nombre}-${c.telefono}-${c.estado}-${c.ciudad}`, c])).values());
            
            const filteredResults = sizes.size > 0 
                ? uniqueResults.filter(c => sizes.has(c.tamanio))
                : uniqueResults;

            setCompanies(filteredResults);

        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleExport = useCallback(() => {
        if (companies.length > 0) {
            exportToCsv(companies, 'empresas_resultado.csv');
        }
    }, [companies]);

    return (
        <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Clientes potenciales by Lalo Carrrillo</h1>
                <p className="text-lg text-gray-600 mt-2">
                    Encuentra clientes potenciales usando la API oficial de DENUE del INEGI.
                </p>
            </header>

            <main className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <SearchForm onSearch={handleSearch} isLoading={isLoading} />

                <div className="mt-8">
                    {isLoading && (
                        <div className="flex justify-center items-center flex-col text-center p-8">
                            <LoadingSpinner />
                            <p className="mt-4 text-lg text-gray-600 font-semibold">Buscando empresas...</p>
                            <p className="text-gray-500">Esto puede tardar un momento.</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center items-center flex-col text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                            <ErrorIcon />
                            <p className="mt-4 text-lg text-red-700 font-semibold">Ocurrió un error</p>
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                    {!isLoading && !error && searchPerformed && companies.length === 0 && (
                         <div className="flex justify-center items-center flex-col text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
                            <InfoIcon />
                            <p className="mt-4 text-lg text-blue-700 font-semibold">No se encontraron resultados</p>
                            <p className="text-blue-600">Intenta ajustar tus criterios de búsqueda.</p>
                        </div>
                    )}
                    {!isLoading && !error && companies.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-700">
                                    Se encontraron <span className="text-blue-600">{companies.length}</span> empresas
                                </h2>
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                >
                                    Exportar a CSV
                                </button>
                            </div>
                            <ResultsTable companies={companies} />
                        </div>
                    )}
                </div>
            </main>
             <footer className="text-center mt-8 text-sm text-gray-500">
                <p>Datos obtenidos de la API DENUE del INEGI. Esta es una herramienta independiente.</p>
                <p>Cumplimos con todas las normas de ley vigentes.</p>
                <p>Lalo Carrillo</p>
            </footer>
        </div>
    );
};

export default App;