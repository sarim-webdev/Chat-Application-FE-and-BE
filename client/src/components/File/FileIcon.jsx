import {
  BsFileEarmark,
  BsFileEarmarkPdf,
  BsFileEarmarkWord,
  BsFileEarmarkExcel,
  BsFileEarmarkPpt,
  BsFileEarmarkZip,
  BsFileEarmarkImage,
  BsFileEarmarkPlay,
  BsFileEarmarkMusic,
  BsFileEarmarkCode,
  BsFileEarmarkText,
} from "react-icons/bs";

function FileIcon({ mimeType = "" }) {
  if (mimeType.includes("pdf")) {
    return (
      <BsFileEarmarkPdf
        size={34}
        className="text-red-500 flex-shrink-0"
      />
    );
  }

  if (
    mimeType.includes("word") ||
    mimeType.includes("msword") ||
    mimeType.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
  ) {
    return (
      <BsFileEarmarkWord
        size={34}
        className="text-blue-500 flex-shrink-0"
      />
    );
  }

  if (
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("sheet")
  ) {
    return (
      <BsFileEarmarkExcel
        size={34}
        className="text-green-500 flex-shrink-0"
      />
    );
  }

  if (
    mimeType.includes("powerpoint") ||
    mimeType.includes("presentation")
  ) {
    return (
      <BsFileEarmarkPpt
        size={34}
        className="text-orange-500 flex-shrink-0"
      />
    );
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z") ||
    mimeType.includes("compressed")
  ) {
    return (
      <BsFileEarmarkZip
        size={34}
        className="text-yellow-500 flex-shrink-0"
      />
    );
  }

  if (mimeType.startsWith("image/")) {
    return (
      <BsFileEarmarkImage
        size={34}
        className="text-pink-500 flex-shrink-0"
      />
    );
  }

  if (mimeType.startsWith("video/")) {
    return (
      <BsFileEarmarkPlay
        size={34}
        className="text-purple-500 flex-shrink-0"
      />
    );
  }

  if (mimeType.startsWith("audio/")) {
    return (
      <BsFileEarmarkMusic
        size={34}
        className="text-cyan-500 flex-shrink-0"
      />
    );
  }

  if (
    mimeType.includes("javascript") ||
    mimeType.includes("json") ||
    mimeType.includes("html") ||
    mimeType.includes("css") ||
    mimeType.includes("xml") ||
    mimeType.includes("typescript")
  ) {
    return (
      <BsFileEarmarkCode
        size={34}
        className="text-indigo-500 flex-shrink-0"
      />
    );
  }

  if (
    mimeType.includes("text") ||
    mimeType.includes("txt")
  ) {
    return (
      <BsFileEarmarkText
        size={34}
        className="text-gray-300 flex-shrink-0"
      />
    );
  }

  return (
    <BsFileEarmark
      size={34}
      className="text-gray-400 flex-shrink-0"
    />
  );
}

export default FileIcon;