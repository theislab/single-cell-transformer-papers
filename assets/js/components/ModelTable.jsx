import React, { useState, useMemo } from 'react';
import FilterSidebar from './FilterSidebar';
import { Button } from './ui/button';

const ModelTable = ({ data }) => {
  // Initialize filter state
  const [filters, setFilters] = useState({
    paper: [],
    code: [],
    omicModalities: [],
    inputEmbeddings: [],
    architecture: [],
  });

  // Toggle sidebar visibility
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters to data using useMemo to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    return filterData(data, filters);
  }, [data, filters]);

  return (
    <div className="relative">
      {/* Filter toggle button */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="mb-4"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className="flex gap-4">
        {/* Filter sidebar */}
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          visible={showFilters}
        />

        {/* Main table content */}
        <div className="flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Add your table headers here */}
                <th>Paper</th>
                <th>Code</th>
                <th>Omic Modalities</th>
                <th>Input Embeddings</th>
                <th>Architecture</th>
                {/* Add other headers as needed */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.paper.type === 'preprint' ? '📝' : '📄'} 
                    {/* Add paper title/link */}
                  </td>
                  <td>
                    {item.code.type === 'reproducible' ? '🛠️' : 
                     item.code.type === 'evaluation_only' ? '🔍' : ''}
                    {/* Add code link */}
                  </td>
                  <td>{item.omic_modalities}</td>
                  <td>{item.input_embedding}</td>
                  <td>{item.architecture}</td>
                  {/* Add other cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Show message when no results */}
          {filteredData.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No results found with the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Keep the filterData function as previously defined
const filterData = (data, filters) => {
  return data.filter(item => {
    // Paper type filter
    if (filters.paper?.length > 0) {
      const paperType = item.paper.type;
      if (!filters.paper.includes(paperType)) return false;
    }

    // Code type filter
    if (filters.code?.length > 0) {
      const codeType = item.code.type;
      if (!filters.code.includes(codeType)) return false;
    }

    // Omic modalities filter
    if (filters.omicModalities?.length > 0) {
      const hasMatchingModality = filters.omicModalities.some(modality =>
        item.omic_modalities.toLowerCase().includes(modality.toLowerCase())
      );
      if (!hasMatchingModality) return false;
    }

    // Input embeddings filter
    if (filters.inputEmbeddings?.length > 0) {
      const inputEmbedding = item.input_embedding.toLowerCase();
      const hasMatchingEmbedding = filters.inputEmbeddings.some(embedding =>
        inputEmbedding.includes(embedding.toLowerCase())
      );
      if (!hasMatchingEmbedding) return false;
    }

    // Architecture filter
    if (filters.architecture?.length > 0) {
      const architecture = item.architecture.toLowerCase();
      const hasMatchingArchitecture = filters.architecture.some(arch =>
        architecture.includes(arch.toLowerCase())
      );
      if (!hasMatchingArchitecture) return false;
    }

    return true;
  });
};

export default ModelTable; 