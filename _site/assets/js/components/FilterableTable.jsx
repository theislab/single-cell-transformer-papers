import React, { useState } from 'react';
import { Filter, FileText, Github, X } from 'lucide-react';

const FilterableTable = ({ data = [], columns = [] }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  // Inline SVG Icon Components
  const PreprintIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m5 2H6v16h12v-9h-7V4m2 4v6h2V8h-2m0 8v2h2v-2h-2z"/>
    </svg>
  );

  const PublicationIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6m4 18H6V4h7v5h5v11m-3-8.5V15H7v-1.5h8m0 3.5v1.5H7V16h8z"/>
    </svg>
  );

  const ReproducibleIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
    </svg>
  );

  const EvaluationIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
    </svg>
  );

  const RetractedIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-red-500">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
    </svg>
  );

  const PaperTypeIcon = ({ type }) => {
    if (type?.includes('preprint')) {
      return <PreprintIcon />;
    }
    return <PublicationIcon />;
  };

  const CodeTypeIcon = ({ type }) => {
    switch (type?.toLowerCase()) {
      case 'reproducible':
        return <ReproducibleIcon />;
      case 'evaluation':
        return <EvaluationIcon />;
      case 'retracted':
        return <RetractedIcon />;
      default:
        return <ReproducibleIcon />;
    }
  };

  const formatCell = (content, column, row) => {
    if (!content) return '';

    if (column.toLowerCase() === 'pre-training dataset') {
      const links = content.match(/\[(.*?)\]\((.*?)\)/g) || [];
      return (
        <div className="space-y-1">
          {links.map((link, index) => {
            const [_, text, url] = link.match(/\[(.*?)\]\((.*?)\)/) || [];
            return (
              <div key={index} className="flex items-center gap-2">
                <FileText className="w-4 h-4 shrink-0 text-gray-400" />
                <a 
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {text}
                </a>
              </div>
            );
          })}
          {content.replace(/\[(.*?)\]\((.*?)\)/g, '')}
        </div>
      );
    }

    if (column.toLowerCase() === 'paper') {
      const paperMatch = content.match(/\[(.*?)\]\((.*?)\)/);
      if (paperMatch) {
        const [_, text, url] = paperMatch;
        const journalMatch = text.match(/\((.*?)\)\[(.*?)\]/);
        
        return (
          <div className="flex items-center gap-2">
            <div className="text-gray-600">
              <PaperTypeIcon type={row.paperType || 'publication'} />
            </div>
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {journalMatch ? (
                <>
                  <span className="text-gray-600">{journalMatch[1]}</span>
                  <span className="mx-1">·</span>
                  <span>{journalMatch[2]}</span>
                </>
              ) : text}
            </a>
          </div>
        );
      }
    }

    if (column.toLowerCase() === 'code') {
      if (content.includes('http')) {
        return (
          <div className="flex items-center gap-2">
            <div className="text-gray-600">
              <CodeTypeIcon type={row.codeType || 'reproducible'} />
            </div>
            <a 
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              GitHub
            </a>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <div className="text-gray-600">
            <CodeTypeIcon type={row.codeType || 'reproducible'} />
          </div>
          <span>{content}</span>
        </div>
      );
    }

    return content;
  };

  return (
    <div className="w-full">
      {/* Filter Button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setShowSidebar(true)} 
          className="inline-flex items-center px-4 py-2 gap-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(column => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {columns.map(column => (
                    <td key={column} className="px-6 py-4 text-sm text-gray-900">
                      {formatCell(row[column.toLowerCase()], column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilterableTable;