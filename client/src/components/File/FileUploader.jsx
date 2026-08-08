import { useRef } from "react";
import { BsPaperclip } from "react-icons/bs";

function FileUploader({
  onFileSelect,
  disabled = false,
}) {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    onFileSelect(file);

    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileRef}
        hidden
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        accept="
          .pdf,
          .doc,
          .docx,
          .xls,
          .xlsx,
          .ppt,
          .pptx,
          .txt,
          .zip,
          .rar,
          .7z,
          .csv,
          .json,
          .xml,
          .js,
          .jsx,
          .ts,
          .tsx,
          .html,
          .css,
          .scss,
          .md
        "
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => fileRef.current?.click()}
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
          rounded-full flex items-center justify-center
          transition text-lg sm:text-xl md:text-2xl flex-shrink-0
          ${
            disabled
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "hover:bg-white/10 active:bg-white/20 text-gray-300 hover:text-blue-400"
          }`}
      >
        <BsPaperclip />
      </button>
    </>
  );
}

export default FileUploader;