import React, { useState } from 'react';
import { Button } from './ui/button';
import FilterGroup from './FilterGroup';

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
    { value: 'Bulk RNA-seq', label: 'Bulk RNA-seq' },
    { value: 'scRNA-seq', label: 'scRNA-seq' },
    { value: 'DNAm', label: 'DNAm' },
    { value: 'proteomics', label: 'Proteomics' },
    { value: 'natural language', label: 'Natural Language' },
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

const FilterPanel = ({ isOpen, onClose, onApplyFilters }) => {
  const [tempFilters, setTempFilters] = useState({
    paper: [],
    code: [],
    omicModalities: [],
    inputEmbeddings: [],
    architecture: [],
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-80 bg-white shadow-lg z-50 overflow-hidden">
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
          <h3 className="text-lg font-medium">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close filters"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-20">
          {Object.entries(FILTER_OPTIONS).map(([filterType, options]) => (
            <div key={filterType} className="mb-6">
              <h4 className="font-medium mb-2 text-sm uppercase tracking-wide">
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </h4>
              <div className="space-y-3">
                {options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 py-1 px-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={tempFilters[filterType].includes(option.value)}
                      onChange={(e) => {
                        const newValues = e.target.checked
                          ? [...tempFilters[filterType], option.value]
                          : tempFilters[filterType].filter(v => v !== option.value);
                        setTempFilters(prev => ({
                          ...prev,
                          [filterType]: newValues,
                        }));
                      }}
                      className="w-4 h-4 rounded border-gray-300"
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
              setTempFilters({
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
            onClick={() => onApplyFilters(tempFilters)}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;