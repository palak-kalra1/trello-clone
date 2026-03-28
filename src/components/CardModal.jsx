import { useState } from "react";

function CardModal({ card, onClose, updateCard }) {
  const [text, setText] = useState(card.text);
  const [description, setDescription] = useState(card.description || "");

  function handleSave() {
    updateCard(card.id, { text, description });
    onClose();
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Edit Card</h2>

        <input value={text} onChange={(e) => setText(e.target.value)} />

        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
};

const modal = {
  background: "white",
  padding: "20px",
  margin: "100px auto",
  width: "300px",
};

export default CardModal;