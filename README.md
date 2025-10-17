# Markdown to HTML Converter

This project converts Markdown input to HTML using the `marked` library and renders it inside a designated container. It supports loading Markdown from data URLs and properly handles base64 decoding.

## Setup

1. Save all files in the same directory.
2. Open `index.html` in a modern web browser.

## Usage

- The application automatically loads and converts the Markdown content from the provided attachment.
- The converted HTML is rendered inside the `#markdown-output` element.

## Code Explanation

- `index.html`: Provides the basic structure with a container for the output and script includes.
- `style.css`: Basic styling for a clean presentation.
- `script.js`: Handles data URL parsing, base64 decoding, Markdown processing with `marked`, and DOM insertion.

## License
MIT