import React, { useState, useEffect } from 'react';
import FilterableTable from '../components/FilterableTable';
import { mountReactComponent } from '../utils/mount';
import FilterButton from '../components/FilterButton';
import FilterPanel from '../components/FilterPanel';


function TransformerEvaluation() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        try {
            if (typeof window.transformerEvaluation !== 'undefined') {
                const processedData = window.transformerEvaluation.map(item => {
                    // Helper function to handle empty/null values
                    const processEmptyValue = (value) => {
                        if (value === '' || value === null || value === undefined || value === 'None') {
                            return '-';
                        }
                        return value;
                    };

                    return {
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
                        'Evaluated Transformers': processEmptyValue(item.evaluated_transformers),
                        'Tasks': processEmptyValue(item.tasks),
                        'Notes': processEmptyValue(item.notes)
                    };
                });
                
                setData(processedData);
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

    console.log('Rendering state:', { isLoading, error, hasData: !!data });

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!data?.length) return <div className="p-4">No data available</div>;

    return (
        <div className="w-full">
            <h1 className="text-2xl font-normal mb-4 text-center">Transformer Evaluation</h1>
            <div className="w-full overflow-hidden">
                <FilterableTable 
                    data={data}
                    columns={[
                        'Paper',
                        'Code',
                        'Omic Modalities',
                        'Evaluated Transformers',
                        'Tasks',
                        'Notes'
                    ]}
                />
            </div>
        </div>
    );
}

export default TransformerEvaluation;

if (document.getElementById('transformer-evaluation-root')) {
    console.log('Mounting TransformerEvaluation component');
    const root = ReactDOM.createRoot(document.getElementById('transformer-evaluation-root'));
    root.render(<TransformerEvaluation />);
}