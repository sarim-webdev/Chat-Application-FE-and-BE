import { BsDownload } from "react-icons/bs";

function DownloadButton({
  url,
  fileName = "file",
}) {
  const handleDownload = async () => {
    const response = await fetch(url);

    const blob = await response.blob();

    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = objectUrl;
    a.download = fileName;

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(objectUrl);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="
        w-10 h-10
        rounded-full
        bg-blue-600
        hover:bg-blue-700
        active:scale-95
        transition-all
        duration-200
        flex
        items-center
        justify-center
        text-white
        shadow-md
      "
      title="Download File"
    >
      <BsDownload size={18} />
    </button>
  );
}

export default DownloadButton;