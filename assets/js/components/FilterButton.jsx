import React, { useState, useEffect } from 'react';

const FILTER_OPTIONS = {
  paper: [
    { value: 'preprint', label: 'Preprint 📝' },
    { value: 'peer_reviewed', label: 'Peer Reviewed 📄' },
  ],
  code: [
    { value: 'reproducible', label: 'Training Code Available 🛠️' },
    { value: 'evaluation_only', label: 'Evaluation Only 🔍' },
    { value: 'none', label: 'None' },
  ],
  omicModalities: [
    { value: 'Bulk/scRNA-seq', label: 'Bulk/scRNA-seq' },
    { value: 'DNAm', label: 'DNAm' },
    { value: 'proteomics', label: 'Proteomics' },
    { value: 'natural language', label: 'Natural Language' },
    { value: 'scRNA-seq', label: 'scRNA-seq' },
    { value: 'scATAC-seq', label: 'scATAC-seq' },
    { value: 'CITE-seq', label: 'CITE-seq' },
    { value: 'Spatial transcriptomics', label: 'Spatial Transcriptomics' },
    { value: 'single-cell flow cytometry', label: 'Flow Cytometry' },
  ],
  inputEmbeddings: [
    { value: 'cells as tokens', label: 'Cells as Tokens' },
    { value: 'ordering', label: 'Ordering' },
    { value: 'other', label: 'Other' },
    { value: 'value categorization', label: 'Value Categorization' },
    { value: 'value projection', label: 'Value Projection' },
  ],
  architecture: [
    { value: 'encoder', label: 'Encoder' },
    { value: 'decoder', label: 'Decoder' },
    { value: 'encoder-decoder', label: 'Encoder-Decoder' },
    { value: 'other', label: 'Other' },
  ],
};

const FilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    paper: [],
    code: [],
    omicModalities: [],
    inputEmbeddings: [],
    architecture: [],
  });

  // Attach to existing filter button
  useEffect(() => {
    const existingFilterButton = document.querySelector('[data-testid="Filter"]');
    
    if (existingFilterButton) {
      const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
      };
      
      existingFilterButton.addEventListener('click', handleClick);
      
      return () => {
        existingFilterButton.removeEventListener('click', handleClick);
      };
    }
  }, [isOpen]);

  return isOpen ? (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50">
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {Object.entries(FILTER_OPTIONS).map(([filterType, options]) => (
            <div key={filterType} className="mb-6">
              <h4 className="font-medium mb-2">
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </h4>
              <div className="space-y-2">
                {options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters[filterType].includes(option.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...filters[filterType], option.value]
                          : filters[filterType].filter(v => v !== option.value);
                        setFilters(prev => ({
                          ...prev,
                          [filterType]: newValues,
                        }));
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => {
              setFilters({
                paper: [],
                code: [],
                omicModalities: [],
                inputEmbeddings: [],
                architecture: [],
              });
            }}
          >
            Reset
          </button>
          <button
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => {
              // Apply filters logic here
              setIsOpen(false);
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default FilterButton; 