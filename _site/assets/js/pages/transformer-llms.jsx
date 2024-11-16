import React, { useState, useEffect } from 'react';
import FilterableTable from '../components/FilterableTable';
import { mountReactComponent } from '../utils/mount';
import FilterButton from '../components/FilterButton';
import FilterPanel from '../components/FilterPanel';


function TransformerLLMs() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        try {
            if (typeof window.transformerLLMs !== 'undefined') {
                const processedData = window.transformerLLMs.map(item => {
                    const processEmptyValue = (value) => {
                        if (value === '' || value === null || value === undefined || value === 'None' || value === '-') {
                            return '-';
                        }
                        return value;
                    };

                    console.log('Processing item architecture:', item.architecture);

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
                        Architecture: (() => {
                            const arch = item.architecture;
                            if (!arch) return '-';
                            
                            const linkMatch = arch.match(/\[(.*?)\]\((.*?)\)/);
                            if (linkMatch) {
                                return {
                                    text: linkMatch[1],
                                    url: linkMatch[2],
                                    type: 'link'
                                };
                            }
                            
                            return arch;
                        })(),
                        'SSL Tasks': processEmptyValue(item.ssl_tasks),
                        'Supervised Tasks': processEmptyValue(item.supervised_tasks),
                        'Zero-Shot Tasks': processEmptyValue(item.zero_shot_tasks)
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
            <h1 className="text-2xl font-normal mb-4 text-center">Transformer LLMs</h1>
            <div className="w-full overflow-hidden">
                <FilterableTable 
                    data={data}
                    columns={[
                        'Model',
                        'Paper',
                        'Code',
                        'Omic Modalities',
                        'Pre-Training Dataset',
                        'Input Embedding',
                        'Architecture',
                        'SSL Tasks',
                        'Supervised Tasks',
                        'Zero-Shot Tasks'
                    ]}
                />
            </div>
        </div>
    );
}

export default TransformerLLMs;

if (document.getElementById('transformer-llms-root')) {
    console.log('Mounting TransformerLLMs component');
    const root = ReactDOM.createRoot(document.getElementById('transformer-llms-root'));
    root.render(<TransformerLLMs />);
}
