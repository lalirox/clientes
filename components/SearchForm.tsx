
import React, { useState } from 'react';

export interface SearchParams {
    token: string;
    keywords: string;
    states: string;
    isMedium: boolean;
    isLarge: boolean;
    latitude?: number;
    longitude?: number;
    radius?: number;
}

interface SearchFormProps {
    onSearch: (params: SearchParams) => void;
    isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
    const [token, setToken] = useState('');
    const [keywords, setKeywords] = useState('');
    const [states, setStates] = useState('');
    const [isMedium, setIsMedium] = useState(false);
    const [isLarge, setIsLarge] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [radius, setRadius] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            token,
            keywords,
            states,
            isMedium,
            isLarge,
            latitude: latitude ? parseFloat(latitude) : undefined,
            longitude: longitude ? parseFloat(longitude) : undefined,
            radius: radius ? parseInt(radius, 10) : undefined,
        });
    };

    const isGeoSearch = latitude || longitude || radius;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">API Configuration</h3>
                <div>
                    <label htmlFor="token" className="block text-sm font-medium text-gray-700">DENUE Token</label>
                    <input
                        type="text"
                        id="token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter your INEGI DENUE API token"
                        required
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Search Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords (comma-separated)</label>
                        <input
                            type="text"
                            id="keywords"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., comercio, legal, consultoría"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="states" className="block text-sm font-medium text-gray-700">State Codes (comma-separated, optional)</label>
                        <input
                            type="text"
                            id="states"
                            value={states}
                            onChange={(e) => setStates(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., 09, 15, 19 (defaults to national)"
                            disabled={isGeoSearch}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">Company Size (optional)</label>
                    <div className="mt-2 flex items-center space-x-6">
                        <div className="flex items-center">
                            <input id="medium" type="checkbox" checked={isMedium} onChange={(e) => setIsMedium(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                            <label htmlFor="medium" className="ml-2 block text-sm text-gray-900">Medium (Mediana)</label>
                        </div>
                         <div className="flex items-center">
                            <input id="large" type="checkbox" checked={isLarge} onChange={(e) => setIsLarge(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                            <label htmlFor="large" className="ml-2 block text-sm text-gray-900">Large (Grande)</label>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">If neither is checked, all sizes will be included.</p>
                </div>
            </div>

             <div>
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Geographic Search (Optional)</h3>
                <p className="text-sm text-gray-500 mb-4">Filling these fields will perform a search within a radius, overriding the state codes.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input type="number" step="any" id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 19.4326"/>
                    </div>
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input type="number" step="any" id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., -99.1332"/>
                    </div>
                    <div>
                        <label htmlFor="radius" className="block text-sm font-medium text-gray-700">Radius (meters)</label>
                        <input type="number" id="radius" value={radius} onChange={(e) => setRadius(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 5000"/>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
};
