const { Octokit } = require('@octokit/rest');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER || 'stb13579';
const REPO_NAME = process.env.REPO_NAME || 'traffic-monitor';
const CSV_FILE = process.env.CSV_FILE || 'traffic-data.csv';

async function fetchCloneStats() {
  if (!GITHUB_TOKEN) {
    console.error('Error: GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  });

  try {
    console.log(`Fetching clone statistics for ${REPO_OWNER}/${REPO_NAME}...`);
    
    const { data } = await octokit.rest.repos.getClones({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per: 'day'
    });

    return data;
  } catch (error) {
    console.error('Error fetching clone statistics:', error.message);
    if (error.status === 403) {
      console.error('Permission denied. Make sure the GITHUB_TOKEN has the necessary permissions.');
    }
    throw error;
  }
}

async function writeToCSV(data) {
  const csvFilePath = path.join(__dirname, CSV_FILE);
  const fileExists = fs.existsSync(csvFilePath);
  
  const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'date', title: 'Date' },
      { id: 'count', title: 'Count' },
      { id: 'uniques', title: 'Uniques' },
      { id: 'total_count', title: 'Total Count' },
      { id: 'total_uniques', title: 'Total Uniques' }
    ],
    append: fileExists
  });

  const timestamp = new Date().toISOString();
  const records = [];

  // Add overall statistics
  if (data.clones && data.clones.length > 0) {
    // Add each day's data
    for (const clone of data.clones) {
      records.push({
        timestamp: timestamp,
        date: clone.timestamp,
        count: clone.count,
        uniques: clone.uniques,
        total_count: data.count,
        total_uniques: data.uniques
      });
    }
  } else {
    // If no clone data, still record the totals
    records.push({
      timestamp: timestamp,
      date: new Date().toISOString().split('T')[0],
      count: 0,
      uniques: 0,
      total_count: data.count || 0,
      total_uniques: data.uniques || 0
    });
  }

  await csvWriter.writeRecords(records);
  console.log(`Data written to ${csvFilePath}`);
  console.log(`Total clones: ${data.count}, Total unique cloners: ${data.uniques}`);
  
  return records;
}

async function main() {
  try {
    const cloneData = await fetchCloneStats();
    await writeToCSV(cloneData);
    console.log('Clone statistics successfully recorded!');
  } catch (error) {
    console.error('Failed to record clone statistics:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fetchCloneStats, writeToCSV, main };
