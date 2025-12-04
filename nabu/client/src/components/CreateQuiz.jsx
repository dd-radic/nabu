import React, { useState } from 'react';
import Question from './Question';

const CreateQuiz = ({ isOpen, onClose, params }) => {
  const [list, setList] = useState([]);
  const renderList = [];

  const handleAdd = (item) => {
    console.log("Handle add called");
      list.push(item);
  }

  list.forEach((item, index) =>{
    renderList.push(<li key={index}>{item}</li>);
  });
 

  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <section className="modal-header">
        <h1>Create Quiz</h1>
      </section>
      <section className="modal-main">
        <ul>{renderList}</ul>
        <button type="button" className="modal-add" onClick={handleAdd(<Question/>)}>
            Add Question
        </button>
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  );
};

export default CreateQuiz;
