/**
 * ExportButton — downloads all notes as a .json file.
 *
 * A plain anchor to the export endpoint; the response's
 * Content-Disposition: attachment header drives the download,
 * so no client-side JavaScript is required.
 * Layer: interfaces
 */

export function ExportButton() {
  return (
    <a
      href="/api/notes/export"
      download="quicknotes-export.json"
      className="btn-secondary shrink-0"
      aria-label="Export all notes as a JSON file"
      title="Export all notes as JSON"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
      </svg>
      Export
    </a>
  );
}
