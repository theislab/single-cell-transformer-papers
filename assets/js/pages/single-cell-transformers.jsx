// assets/js/pages/single-cell-transformers.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import FilterableTable from '../components/FilterableTable';
import FilterPanel from '../components/FilterPanel';

function SingleCellTransformers() {
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    useEffect(() => {
        try {
            if (typeof window.singleCellTransformers !== 'undefined') {
                const processedData = window.singleCellTransformers.map(item => {
                    const processEmptyValue = (value) => {
                        if (value === '' || value === null || value === undefined || value === 'None') {
                            return '-';
                        }
                        return value;
                    };

                    return {
                        Model: item.model,
                        Paper: {
                            text: item.paper.text,
                            type: item.paper.type
                        },
                        Code: {
                            text: item.code.text,
                            type: item.code.type
                        },
                        'Omic Modalities': Array.isArray(item.omic_modalities) 
                            ? item.omic_modalities.join(', ') 
                            : processEmptyValue(item.omic_modalities),
                        'Pre-Training Dataset': processEmptyValue(item.pre_training_dataset),
                        'Input Embedding': processEmptyValue(item.input_embedding),
                        Architecture: processEmptyValue(item.architecture),
                        'SSL Tasks': processEmptyValue(item.ssl_tasks),
                        'Supervised Tasks': processEmptyValue(item.supervised_tasks)
                    };
                });
                
                setData(processedData);
                setFilteredData(processedData);
            } else {
                setError('Data not available');
            }
        } catch (err) {
            console.error('Error accessing data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleApplyFilters = (filters) => {
        const filtered = filterData(data, filters);
        setFilteredData(filtered);
    };

    const filterData = (data, filters) => {
        return data.filter(item => {
            // Paper type filter
            if (filters.paper?.length > 0) {
                if (!filters.paper.includes(item.Paper.type)) {
                    return false;
                }
            }

            // Code type filter
            if (filters.code?.length > 0) {
                if (!filters.code.includes(item.Code.type)) {
                    return false;
                }
            }

            // Omic modalities filter
            if (filters.omicModalities?.length > 0) {
                const modalitiesStr = String(item['Omic Modalities']).toLowerCase();
                const hasMatchingModality = filters.omicModalities.some(modality =>
                    modalitiesStr.includes(modality.toLowerCase())
                );
                if (!hasMatchingModality) return false;
            }

            // Input embeddings filter
            if (filters.inputEmbeddings?.length > 0) {
                const embedding = String(item['Input Embedding']).toLowerCase();
                const hasMatchingEmbedding = filters.inputEmbeddings.some(emb =>
                    embedding.includes(emb.toLowerCase())
                );
                if (!hasMatchingEmbedding) return false;
            }

            // Architecture filter
            if (filters.architecture?.length > 0) {
                const architecture = String(item.Architecture).toLowerCase();
                const hasMatchingArchitecture = filters.architecture.some(arch =>
                    architecture.includes(arch.toLowerCase())
                );
                if (!hasMatchingArchitecture) return false;
            }

            return true;
        });
    };

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!data?.length) return <div className="p-4">No data available</div>;

    return (
        <div className="w-full">
            <h1 className="text-2xl font-normal mb-4 text-center">Single-cell Transformers</h1>
            <div className="w-full overflow-hidden">
                <FilterableTable 
                    data={filteredData}
                    columns={[
                        'Model',
                        'Paper',
                        'Code',
                        'Omic Modalities',
                        'Pre-Training Dataset',
                        'Input Embedding',
                        'Architecture',
                        'SSL Tasks',
                        'Supervised Tasks'
                    ]}
                />
            </div>
            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
}

export default SingleCellTransformers;

if (document.getElementById('single-cell-transformers-root')) {
    const root = ReactDOM.createRoot(document.getElementById('single-cell-transformers-root'));
    root.render(<SingleCellTransformers />);
}