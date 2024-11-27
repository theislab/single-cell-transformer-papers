import React from 'react';
import { Checkbox } from './ui/checkbox';

const FilterGroup = ({ title, options, selectedOptions, onChange }) => {
  return (
    <div className="mb-6">
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${option.value}`}
              checked={selectedOptions.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selectedOptions, option.value]);
                } else {
                  onChange(selectedOptions.filter((item) => item !== option.value));
                }
              }}
            />
            <label
              htmlFor={`${title}-${option.value}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup; 