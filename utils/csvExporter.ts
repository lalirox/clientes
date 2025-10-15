
import type { Company } from '../types';

const escapeCsvCell = (cellData: string | null): string => {
    if (cellData === null || cellData === undefined) {
        return '';
    }
    const cell = String(cellData);
    if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
};

export const exportToCsv = (data: Company[], filename: string): void => {
    const headers = [
        "Nombre de la empresa", "Giro o sector", "Tamaño", "Teléfono principal",
        "Correo electrónico de contacto", "Sitio web", "Estado", "Ciudad o municipio", "Fuente"
    ];

    const csvRows = [headers.join(',')];

    data.forEach(company => {
        const row = [
            escapeCsvCell(company.nombre),
            escapeCsvCell(company.giro),
            escapeCsvCell(company.tamanio),
            escapeCsvCell(company.telefono),
            escapeCsvCell(company.correo),
            escapeCsvCell(company.sitio_web),
            escapeCsvCell(company.estado),
            escapeCsvCell(company.ciudad),
            escapeCsvCell(company.fuente),
        ];
        csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
