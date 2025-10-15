
import React from 'react';
import type { Company } from '../types';

interface ResultsTableProps {
    companies: Company[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ companies }) => {
    const headers = [
        "Nombre de la empresa", "Giro o sector", "Tamaño", "Teléfono", "Correo", "Sitio web", "Estado", "Ciudad", "Fuente"
    ];

    const renderCell = (content: string | null) => {
        if (!content) return <span className="text-gray-400 italic">N/A</span>;
        if (content.startsWith('http')) {
            return <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{content}</a>;
        }
        if (content.includes('@')) {
            return <a href={`mailto:${content}`} className="text-blue-600 hover:underline break-all">{content}</a>;
        }
        return content;
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map(header => (
                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map((company, index) => (
                        <tr key={`${company.nombre}-${index}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{renderCell(company.nombre)}</td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{renderCell(company.giro)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderCell(company.tamanio)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderCell(company.telefono)}</td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{renderCell(company.correo)}</td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{renderCell(company.sitio_web)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderCell(company.estado)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderCell(company.ciudad)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{renderCell(company.fuente)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
