import { FileText } from "lucide-react";

interface FileAttachmentProps {
  file: File;
}

export default function FileAttachment({ file }: FileAttachmentProps) {
  const isImage = file.type.startsWith("image/");

  return (
    <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-lg px-3 py-2 max-w-sm">
      {isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-8 h-8 object-cover rounded"
        />
      ) : (
        <div className="flex-shrink-0 w-8 h-8 bg-pink-500 rounded flex items-center justify-center overflow-hidden">
          <FileText className="w-4 h-4 text-white" />
        </div>
      )}
      {!isImage && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{file.type}</p>
        </div>
      )}
    </div>
  );
}
