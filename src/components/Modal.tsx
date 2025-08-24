

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal = ({ title, children, onClose }: ModalProps) => {
  // Stop propagation to prevent modal close when clicking inside content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // close modal when clicking on backdrop
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={handleContentClick}
      >
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};
