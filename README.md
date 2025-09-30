# traffic-monitor
A Node.js script to monitor GitHub repository traffic statistics using the GitHub API. The script automatically tracks clone statistics on a daily basis and saves them to a CSV file.

## Features

- Fetches repository clone statistics using GitHub API
- Stores data in CSV format with timestamp, date, count, and unique clones
- Automated daily execution via GitHub Actions (runs at midnight UTC)
- Can be run manually or as part of a CI/CD pipeline

## Setup

### Prerequisites

- Node.js 18 or higher
- GitHub Personal Access Token with `repo` scope

### Installation

1. Clone this repository:
```bash
git clone https://github.com/stb13579/traffic-monitor.git
cd traffic-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
export GITHUB_TOKEN="your_github_token"
export REPO_OWNER="stb13579"  # Optional, defaults to stb13579
export REPO_NAME="traffic-monitor"  # Optional, defaults to traffic-monitor
export CSV_FILE="traffic-data.csv"  # Optional, defaults to traffic-data.csv
```

### Usage

#### Manual Execution

Run the script manually:
```bash
npm start
```

Or with custom settings:
```bash
GITHUB_TOKEN="your_token" REPO_OWNER="owner" REPO_NAME="repo" node index.js
```

#### Automated Daily Tracking

The repository includes a GitHub Actions workflow that runs automatically every day at midnight UTC (24:00). The workflow:

1. Checks out the repository
2. Installs dependencies
3. Runs the traffic monitoring script
4. Commits and pushes the updated CSV file

The workflow can also be triggered manually from the Actions tab.

## GitHub API

This script uses the following GitHub API endpoint:
```
GET /repos/{owner}/{repo}/traffic/clones
```

## Data Format

The CSV file contains the following columns:
- `Timestamp`: When the data was recorded (ISO 8601 format)
- `Date`: The date of the clone activity
- `Count`: Number of clones on that date
- `Uniques`: Number of unique cloners on that date
- `Total Count`: Total clones in the tracking period
- `Total Uniques`: Total unique cloners in the tracking period

## License

ISC
