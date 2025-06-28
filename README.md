# ValidKit CLI

Command-line interface for ValidKit email validation. Perfect for AI agents and automation.

[![npm version](https://badge.fury.io/js/%40validkit%2Fcli.svg)](https://www.npmjs.com/package/@validkit/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install -g @validkit/cli
```

Or with yarn:
```bash
yarn global add @validkit/cli
```

## Quick Start

1. Get your API key from [https://validkit.com](https://validkit.com)
2. Configure the CLI:
   ```bash
   validkit config --set-key YOUR_API_KEY
   ```
3. Verify an email:
   ```bash
   validkit verify test@example.com
   ```

## Usage

### Single Email Verification

```bash
# Basic verification
validkit verify user@example.com

# With debug information
validkit verify user@example.com --debug

# JSON output for scripts
validkit verify user@example.com --format json

# With trace ID for agent tracking
validkit verify user@example.com --trace-id "langchain-task-123"
```

### Bulk Email Verification

```bash
# Verify emails from a file (one per line)
validkit bulk emails.txt

# Save results to file
validkit bulk emails.txt --output results.json

# Large batch with async processing
validkit bulk large-list.txt --async --webhook https://your-app.com/webhook

# Contribute to Agent Signal Pool
validkit bulk emails.txt --share-signals
```

### Output Formats

- `table` (default) - Human-readable table format
- `json` - Full JSON response
- `compact` - Minimal output for scripts

### Configuration

```bash
# Set API key
validkit config --set-key YOUR_API_KEY

# View current configuration
validkit config --get

# Reset configuration
validkit config --reset
```

### Environment Variables

You can also set your API key via environment variable:
```bash
export VALIDKIT_API_KEY=your_api_key_here
```

Or in a `.env` file:
```
VALIDKIT_API_KEY=your_api_key_here
```

## Examples

### Shell Scripting

```bash
# Check if email is valid
if validkit verify user@example.com --quiet; then
  echo "Email is valid"
else
  echo "Email is invalid"
fi

# Process results with jq
validkit verify user@example.com --format json | jq '.valid'
```

### Pipe Support

```bash
# Verify emails from another command
cat users.csv | cut -d',' -f3 > emails.txt
validkit bulk emails.txt

# One-liner for CSV processing
awk -F',' '{print $2}' contacts.csv | validkit bulk -
```

### Agent Integration

```bash
# With trace ID for multi-agent systems
validkit bulk emails.txt \
  --trace-id "crewai-task-42" \
  --format json \
  --share-signals
```

## Exit Codes

- `0` - Success (email is valid for single verification)
- `1` - Validation failed (email is invalid)
- `2` - Error (API error, network issue, etc.)

## Features

- 🚀 Fast validation for single and bulk emails
- 🤖 Agent-friendly JSON output
- 📊 Progress indicators for bulk operations
- 🔄 Async processing for large batches
- 🔑 Secure API key storage
- 📝 Multiple output formats
- 🎯 Exit codes for scripting

## Support

- Documentation: [https://docs.validkit.com](https://docs.validkit.com)
- Issues: [https://github.com/validkit/cli/issues](https://github.com/validkit/cli/issues)
- Email: support@validkit.com

## License

MIT