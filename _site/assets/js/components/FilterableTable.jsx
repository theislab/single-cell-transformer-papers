import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import FilterPanel from './FilterPanel';

const ICONS = {
    preprint: '📝',
    peer_reviewed: '📄',
    reproducible: '🛠️',
    evaluation_only: '🔍',
};

const TableCell = ({ content, column }) => {
    // Helper function to process links in text
    const processLinks = (text) => {
        if (!text) return '-';
        // Match URLs in text like [ESM-2](https://...)
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        return text.replace(linkRegex, (match, text, url) => {
            return `<a href="${url}" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
        });
    };

    // Helper function to extract value from YAML structure
    const extractValue = (content) => {
        if (typeof content === 'object' && content !== null) {
            if (content.text) return content.text;
            if (content.value) return content.value;
            return Object.values(content).join(', ');
        }
        return content;
    };

    // Handle empty or null content
    if (!content || content === 'None' || content === '') {
        return <td className="px-4 py-2">-</td>;
    }

    // Special handling for columns that might contain links
    if (column === 'INPUT EMBEDDING' || column === 'PRE-TRAINING DATASET') {
        const processedContent = processLinks(content);
        return (
            <td 
                className="px-4 py-2"
                dangerouslySetInnerHTML={{ __html: processedContent }}
            />
        );
    }

    // Special handling for Paper column
    if (column === 'PAPER') {
        const paperContent = content.text || content;
        const paperType = content.type || 'preprint';
        const match = paperContent.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
            const [_, title, url] = match;
            return (
                <td className="px-4 py-2">
                    <span className="mr-2">{ICONS[paperType]}</span>
                    <a href={url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {title}
                    </a>
                </td>
            );
        }
    }

    // Special handling for Code column
    if (column === 'CODE') {
        const codeContent = content.text || content;
        const codeType = content.type || 'evaluation_only';
        const match = codeContent?.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
            const [_, __, url] = match;
            return (
                <td className="px-4 py-2">
                    <a href={url} className="text-gray-600 hover:text-gray-800" target="_blank" rel="noopener noreferrer">
                        {ICONS[codeType]}
                    </a>
                </td>
            );
        }
        return <td className="px-4 py-2">-</td>;
    }

    // Special handling for Pre-Training Dataset
    if (column === 'PRE-TRAINING DATASET') {
        return <td className="px-4 py-2">{content === '' ? '-' : content}</td>;
    }

    // Handle special columns that might be nested
    const specialColumns = [
        'OMIC MODALITIES',
        'PRE-TRAINING DATASET',
        'INPUT EMBEDDING',
        'ARCHITECTURE',
        'SSL TASKS',
        'SUPERVISED TASKS',
        'ZERO-SHOT TASKS'
    ];

    if (specialColumns.includes(column)) {
        const value = extractValue(content);
        return <td className="px-4 py-2">{value || '-'}</td>;
    }

    // Default handling for other columns
    return <td className="px-4 py-2">{extractValue(content)}</td>;
};

const FilterableTable = ({ data, columns }) => {
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [filteredData, setFilteredData] = useState(data);

    const handleFilterClick = () => {
        setIsFilterPanelOpen(!isFilterPanelOpen);
    };

    const handleApplyFilters = (filters) => {
        const filtered = data.filter(item => {
            // Paper type filter
            if (filters.paper?.length > 0) {
                const paperType = item.Paper?.type;
                if (!filters.paper.includes(paperType)) return false;
            }

            // Code type filter
            if (filters.code?.length > 0) {
                const codeType = item.Code?.type;
                if (!filters.code.includes(codeType)) return false;
            }

            // Omic modalities filter
            if (filters.omicModalities?.length > 0) {
                const modalitiesStr = String(item['Omic Modalities'] || '').toLowerCase();
                const hasMatchingModality = filters.omicModalities.some(modality => {
                    if (modality === 'Bulk RNA-seq') {
                        // Match any form of "bulk" in the string
                        return /bulk/i.test(modalitiesStr);
                    }
                    // For other modalities, use exact matching as before
                    return modalitiesStr.includes(modality.toLowerCase());
                });
                if (!hasMatchingModality) return false;
            }

            // Input embeddings filter
            if (filters.inputEmbeddings?.length > 0) {
                const embedding = String(item['Input Embedding'] || '').toLowerCase();
                const hasMatchingEmbedding = filters.inputEmbeddings.some(emb =>
                    embedding.includes(emb.toLowerCase())
                );
                if (!hasMatchingEmbedding) return false;
            }

            // Architecture filter
            if (filters.architecture?.length > 0) {
                const architecture = String(item.Architecture || '').toLowerCase();
                const hasMatchingArchitecture = filters.architecture.some(arch =>
                    architecture.includes(arch.toLowerCase())
                );
                if (!hasMatchingArchitecture) return false;
            }

            return true;
        });

        setFilteredData(filtered);
        setIsFilterPanelOpen(false);
    };

    return (
        <div className="w-full">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 
                             rounded-md transition-colors"
                    data-testid="filter-button"
                >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                </button>
            </div>

            <div className={`transition-all duration-300 ${isFilterPanelOpen ? 'sm:mr-96 md:mr-80' : ''}`}>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            {columns.map(column => (
                                <th key={column} className="px-4 py-2 text-left bg-gray-100 font-medium">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(filteredData || data).map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {columns.map(column => (
                                    <TableCell 
                                        key={column} 
                                        content={row[column]} 
                                        column={column.toUpperCase()}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
};

export default FilterableTable;