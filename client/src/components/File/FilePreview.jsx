import FileIcon from "./FileIcon";

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(2)} MB`;
}

function FilePreview({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
      <div className="flex items-center gap-3 overflow-hidden">
        <FileIcon mimeType={file.type} />

        <div className="overflow-hidden">
          <p className="truncate text-sm font-medium text-white">
            {file.name}
          </p>

          <p className="text-xs text-gray-400">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="ml-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
      >
        ✕
      </button>
    </div>
  );
}

export default FilePreview;