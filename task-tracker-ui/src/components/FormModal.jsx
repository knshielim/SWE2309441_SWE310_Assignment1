// Modal for displaying forms
function FormModal({ children, onClose, maxWidth = "max-w-xl" }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl p-6`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white text-gray-600 border border-gray-300 rounded-full w-8 h-8 hover:bg-gray-50 shadow-sm"
          aria-label="Close form"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default FormModal;
