// components/FilterSidebar.jsx
import React from 'react';
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

const FilterSidebar = ({ filters, setFilters, visible }) => {
  if (!visible) return null;

  const handleFilterChange = (filterType, selectedValues) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: selectedValues,
    }));
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h3 className="font-medium mb-4">Filters</h3>
      {Object.entries(FILTER_OPTIONS).map(([filterType, options]) => (
        <FilterGroup
          key={filterType}
          title={filterType === 'omicModalities' ? 'OMIC-MODALITIES' : 
                 filterType === 'inputEmbeddings' ? 'INPUT EMBEDDINGS' :
                 filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          options={options}
          selectedOptions={filters[filterType] || []}
          onChange={(selectedValues) => handleFilterChange(filterType, selectedValues)}
        />
      ))}
    </div>
  );
};

export default FilterSidebar;