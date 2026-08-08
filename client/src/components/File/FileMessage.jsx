import FileIcon from "./FileIcon";
import DownloadButton from "./DownloadButton";

function formatFileSize(bytes) {
  if (!bytes) return "Unknown Size";

  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return (
    (bytes / Math.pow(1024, i)).toFixed(2) +
    " " +
    sizes[i]
  );
}

function FileMessage({ file }) {
  if (!file?.url) return null;

  return (
    <div className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 p-2 sm:p-3 flex items-center gap-2 sm:gap-3">

      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">

        <div className="flex-shrink-0">
          <FileIcon mimeType={file.mimeType} />
        </div>

        <div className="min-w-0 flex-1">

          <p className="text-xs sm:text-sm md:text-base font-medium text-white truncate">
            {file.originalName}
          </p>

          <p className="text-[10px] sm:text-xs text-gray-400">
            {formatFileSize(file.size)}
          </p>

        </div>

      </div>

      <div className="flex-shrink-0">
        <DownloadButton
          url={file.url}
          fileName={file.originalName}
        />
      </div>

    </div>
  );
}

export default FileMessage;