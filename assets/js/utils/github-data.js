// assets/js/utils/github-data.js
const fetchGitHubData = () => {
    return fetch('https://api.github.com/repos/theislab/single-cell-transformer-papers/contents/README.md', {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const content = atob(data.content);
        return parseMarkdownTables(content);
    });
}

const parseMarkdownTables = (markdown) => {
    if (!markdown) {
        throw new Error('No content to parse');
    }

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

const parseTable = (lines) => {
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
                rowData[header] = cells[index];
            });
            data.push(rowData);
        }
    }
    
    return data;
}

module.exports = { fetchGitHubData };