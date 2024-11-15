import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

const ICONS = {
    PREPRINT: '📝',      // Changed back: 📝 for preprints (arXiv/bioRxiv)
    PUBLICATION: '📄',   // Changed back: 📄 for peer-reviewed publications
    REPRODUCIBLE: '🛠️',  // Fully reproducible code
    EVALUATION: '🔍',    // Evaluation only code
    RETRACTED: '❌'      // Retracted papers
};

const FilterableTable = ({ data = [], columns = [] }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [filters, setFilters] = useState({
        papers: [],
        codeType: [],
        inputEmbedding: [],
        architecture: [],
        modalities: []
    });

    // Function to determine paper type and icon
    const getPaperTypeAndIcon = (content) => {
        if (!content) return { type: 'publication', icon: ICONS.PUBLICATION };
        const lowerContent = content.toLowerCase();
        if (lowerContent.includes('preprint') || lowerContent.includes('arxiv') || lowerContent.includes('biorxiv')) {
            return { type: 'preprint', icon: ICONS.PREPRINT };
        }
        return { type: 'publication', icon: ICONS.PUBLICATION };
    };

    // Function to determine code type and icon
    const getCodeTypeAndIcon = (content) => {
        if (!content) return { type: 'none', icon: '' };
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('huggingface')) {
            return { type: 'huggingface', icon: ICONS.HUGGINGFACE };
        }
        if (lowerContent.includes('evaluation')) {
            return { type: 'evaluation', icon: ICONS.EVALUATION };
        }
        if (lowerContent.includes('retracted')) {
            return { type: 'retracted', icon: ICONS.RETRACTED };
        }
        if (lowerContent.includes('github') || lowerContent.startsWith('http')) {
            return { type: 'reproducible', icon: ICONS.REPRODUCIBLE };
        }
        return { type: 'none', icon: '' };
    };

    // Format cell content with proper icons and links
    const formatCell = (content, column) => {
        if (!content) return 'None';

        switch (column.toLowerCase()) {
            case 'paper':
                const paperMatch = content.match(/\[(.*?)\]\((.*?)\)/);
                if (paperMatch) {
                    const [_, text, url] = paperMatch;
                    let icon = ICONS.PREPRINT;
                    if (text.includes('Zhao et al')) {
                        icon = ICONS.PUBLICATION;
                    } else if (text.includes('Galkin et al')) {
                        icon = ICONS.PREPRINT;
                    }
                    return (
                        <div className="flex items-center gap-2">
                            <span>{icon}</span>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                {text}
                            </a>
                        </div>
                    );
                }
                return content;

            case 'code':
                // Handle any markdown-style links with the wrench icon
                const codeMatch = content.match(/\[(.*?)\]\((.*?)\)/);
                if (codeMatch) {
                    const [_, text, url] = codeMatch;
                    return (
                        <div className="flex items-center gap-2">
                            <span>🛠️</span>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                [link]
                            </a>
                        </div>
                    );
                }

                // Handle GitHub cases
                if (content.includes('GitHub') || content.includes('Github')) {
                    const githubMatch = content.match(/\((.*?)\)/);
                    const url = githubMatch ? githubMatch[1] : '';
                    return (
                        <div className="flex items-center gap-2">
                            <span>🛠️</span>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                GitHub
                            </a>
                        </div>
                    );
                }
                return content;

            case 'architecture':
            case 'input embedding':
            case 'input embeddings':
            case 'pre-training dataset':
                const markdownMatch = content.match(/\[(.*?)\]\((.*?)\)/);
                if (markdownMatch) {
                    const [_, text, url] = markdownMatch;
                    return (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            {text}
                        </a>
                    );
                }
                return content;

            default:
                return content;
        }
    };

    // Filter the data
    const filteredData = React.useMemo(() => {
        return data.filter(row => {
            // Add your filtering logic here if needed
            return true;
        });
    }, [data, filters]);

    return (
        <div className="w-full">
            {/* Filter Button */}
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setShowSidebar(true)}
                    className="inline-flex items-center px-3 py-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    <Filter className="w-4 h-4" />
                    <span className="ml-2">Filter</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className="border p-4 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column) => (
                                    <td
                                        key={column}
                                        className="border p-4 text-sm text-gray-900"
                                    >
                                        {formatCell(row[column.toLowerCase()], column)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Filter Sidebar */}
            <FilterSidebar
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
                filters={filters}
                onFilterChange={setFilters}
            />
        </div>
    );
};

export default FilterableTable;