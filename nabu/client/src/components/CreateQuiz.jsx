
const CreateQuiz = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <section className="modal-main">
        {children}
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  );
};

export default CreateQuiz;
