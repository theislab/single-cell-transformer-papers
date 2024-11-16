const { fetchGitHubData, cleanPreTrainingText } = require('../assets/js/utils/github-data');
const yaml = require('js-yaml');
const fs = require('fs');

async function generateYamlFiles() {
    try {
        const processField = (value) => {
            if (!value || value === 'None' || value.trim() === '') {
                return '-';
            }
            return value.trim();
        };

        const getPaperType = (text) => {
            if (!text) return 'preprint';
            
            // Convert to hex for comparison
            const hex = Buffer.from(text).toString('hex');
            console.log('\nAnalyzing paper text:', text);
            console.log('Paper hex:', hex);
            
            // 📄 pattern followed by journal name in parentheses
            if (hex.includes('c3b0c29fc293c284')) {
                console.log('Found peer reviewed paper');
                return 'peer_reviewed';
            }
            
            console.log('Defaulting to preprint');
            return 'preprint';
        };

        const getCodeType = (text) => {
            if (!text || text.toLowerCase() === 'none') {
                return 'none';
            }
            
            const hex = Buffer.from(text).toString('hex');
            console.log('\nAnalyzing code:', text);
            console.log('Code hex:', hex);
            
            // 🛠️ pattern (reproducible)
            // This appears as c3b0c29fc29bc2a0 in your data
            if (hex.includes('c3b0c29fc29bc2a0')) {
                console.log('Found reproducible code');
                return 'reproducible';
            }
            
            // 🔍 pattern (evaluation only)
            // This appears as c3b0c29fc294c28d in your data
            if (hex.includes('c3b0c29fc294c28d')) {
                console.log('Found evaluation only code');
                return 'evaluation_only';
            }
            
            // If neither pattern is found, it's partial
            console.log('Defaulting to partial');
            return 'partial';
        };

        const cleanText = (text) => {
            if (!text) return '';
            
            // Remove emoji patterns while preserving the rest
            let cleaned = text;
            
            // Remove specific prefixes
            cleaned = cleaned.replace(/\[Partial\s+/g, '[');
            cleaned = cleaned.replace(/\[Incomplete\s+/g, '[');
            
            // Extract markdown link
            const match = cleaned.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
                // If URL is a journal name, extract the actual URL that follows
                if (['Nature', 'Nature MI', 'Nature Meth', 'OUP', 'Frontiers'].includes(match[2])) {
                    const secondMatch = text.match(/\((https?:\/\/.*?)\)/);
                    return `[${match[1]}](${secondMatch ? secondMatch[1] : match[2]})`;
                }
                return `[${match[1]}](${match[2]})`;
            }
            
            return cleaned;
        };

        const tables = await fetchGitHubData();

        // Debug log to see the raw data
        console.log('First row of transformers:', tables.transformers[0]);
        console.log('Available columns:', Object.keys(tables.transformers[0]));

        const transformersYaml = tables.transformers.map(row => {
            // Debug log for each row's pre-training data
            console.log(`Pre-training data for ${row.Model}:`, row['Pre-training Dataset'] || row['Pre-Training Dataset']);
            
            return {
                model: row.Model,
                paper: {
                    type: getPaperType(row.Paper),
                    text: cleanText(row.Paper),
                    url: row.Paper.match(/\((https?:\/\/.*?)\)/)?.[1] || ''
                },
                code: {
                    type: getCodeType(row.Code),
                    text: cleanText(row.Code),
                    url: row.Code.match(/\((https?:\/\/.*?)\)/)?.[1] || ''
                },
                omic_modalities: processField(row['Omic Modalities']),
                pre_training_dataset: processField(row['Pre-training Dataset'] || row['Pre-Training Dataset']),
                input_embedding: processField(row['Input Embedding']),
                architecture: processField(row.Architecture),
                ssl_tasks: processField(row['SSL Tasks']),
                supervised_tasks: processField(row['Supervised Tasks'])
            };
        });

        // Process evaluation table
        const evaluationYaml = tables.evaluation.map(row => ({
            paper: {
                type: getPaperType(row.Paper),
                text: cleanText(row.Paper),
                url: row.Paper.match(/\((https?:\/\/.*?)\)/)?.[1] || ''
            },
            code: {
                type: getCodeType(row.Code),
                text: cleanText(row.Code),
                url: row.Code.match(/\((https?:\/\/.*?)\)/)?.[1] || ''
            },
            omic_modalities: row['Omic Modalities'] || '',
            evaluated_transformers: row['Evaluated Transformers'] || '',
            tasks: row.Tasks || '',
            notes: row.Notes || ''
        }));

        // Process LLMs table
        const llmsYaml = tables.llms.map(row => {
            // Process Architecture field
            let architectureData = {text: '', url: ''};
            
            if (row.Architecture && row.Architecture !== '-') {
                // Check for markdown link format [text](url)
                const linkMatch = row.Architecture.match(/\[(.*?)\]\((.*?)\)/);
                if (linkMatch) {
                    architectureData = {
                        text: linkMatch[1].trim(),
                        url: linkMatch[2].trim()
                    };
                } else {
                    architectureData = {
                        text: row.Architecture.trim(),
                        url: ''
                    };
                }
            }

            return {
                model: row.Model,
                paper: {
                    type: getPaperType(row.Paper),
                    text: cleanText(row.Paper),
                    url: row.Paper.match(/\((https?:\/\/.*?)\)/)?.[1] || ''
                },
                code: {
                    type: getCodeType(row.Code),
                    text: cleanText(row.Code),
                    url: row.Code.match(/\((https?:\/\/.*?)\)/)?.[1] || ''
                },
                omic_modalities: processField(row['Omic Modalities']),
                pre_training_dataset: processField(row['Pre-Training Dataset'] || row['Pre-training Dataset']),
                input_embedding: processField(row['Input Embedding']),
                architecture: architectureData,
                ssl_tasks: processField(row['SSL Tasks']),
                supervised_tasks: processField(row['Supervised Tasks']),
                zero_shot_tasks: processField(row['Zero-Shot Tasks'] || row['Zero-shot Tasks'])
            };
        });

        // Write files
        const yamlOptions = { indent: 2, lineWidth: -1, noRefs: true };
        fs.writeFileSync('_data/single-cell-transformers.yml', yaml.dump(transformersYaml, yamlOptions));
        fs.writeFileSync('_data/transformer-evaluation.yml', yaml.dump(evaluationYaml, yamlOptions));
        fs.writeFileSync('_data/transformer-llms.yml', yaml.dump(llmsYaml, yamlOptions));
        
        console.log('\nYAML files generated successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

generateYamlFiles(); 