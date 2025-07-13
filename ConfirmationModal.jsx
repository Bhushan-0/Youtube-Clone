// Confirmation modal for confirm the user's deletion or logout activity
function ConfirmationModal({ isOpen, onClose, message, callbackFunction }) {

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs`} onClick={onClose}>
            <div className="bg-white w-[400px] p-5 rounded-lg shadow-lg">
                <h2 className="text-xl text-center font-semibold mb-4">
                    {message}
                </h2>
                <div className="flex justify-center gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md cursor-pointer">Cancel</button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer"
                        onClick={() => {
                            onClose();
                            // Execute the function that we get from prop when user confirm
                            callbackFunction();
                        }}
                    >Confirm</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;