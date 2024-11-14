// assets/js/pages/single-cell-transformers.jsx
import React, { useState, useEffect } from 'react';
import FilterableTable from '../components/FilterableTable';
import { mountReactComponent } from '../utils/mount';

function SingleCellTransformers() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('Component mounted');
        fetch('https://api.github.com/repos/theislab/single-cell-transformer-papers/contents/README.md', {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => {
            console.log('Got response:', response.status);
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('Got data:', data);
            const content = atob(data.content);
            const tables = parseMarkdownTables(content);
            console.log('Parsed tables:', tables);
            if (tables?.transformers) {
                setData(tables.transformers);
            } else {
                throw new Error('No transformer data available');
            }
        })
        .catch(err => {
            console.error('Error loading data:', err);
            setError(err.message || 'Failed to load data');
        })
        .finally(() => {
            console.log('Request completed');
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!data?.length) return <div className="p-4">No data available</div>;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Single-cell Transformers</h1>
            <div className="w-full overflow-x-auto">
                <FilterableTable
                    data={data}
                    columns={Object.keys(data[0] || {})}
                />
            </div>
        </div>
    );
}

function parseMarkdownTables(markdown) {
    if (!markdown) return null;
    
    const tables = {
        transformers: [],
        llms: [],
        evaluation: []
    };
    
    const sections = markdown.split('##');
    sections.forEach((section) => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim().toLowerCase();
        
        if (title.includes('single-cell transformers')) {
            tables.transformers = parseTable(lines.slice(2));
        } else if (title.includes('transformer llms')) {
            tables.llms = parseTable(lines.slice(2));
        } else if (title.includes('transformer evaluation')) {
            tables.evaluation = parseTable(lines.slice(2));
        }
    });
    
    return tables;
}

function parseTable(lines) {
    if (!lines || lines.length < 3) return [];
    
    const headerLine = lines.find(line => line.trim().length > 0);
    if (!headerLine) return [];
    
    const headers = headerLine.split('|')
        .map(h => h.trim())
        .filter(Boolean);
    
    const data = [];
    
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('###')) break;
        
        const cells = line.split('|')
            .map(cell => cell.trim())
            .filter(Boolean);
            
        if (cells.length === headers.length) {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header.toLowerCase()] = cells[index];
            });
            data.push(rowData);
        }
    }
    
    return data;
}

// Mount component
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        mountReactComponent('single-cell-transformers-root', SingleCellTransformers);
    });
}

export default SingleCellTransformers;