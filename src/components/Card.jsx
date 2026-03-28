import { useState } from "react";

function Card({ card, deleteCard }) {
  const [show, setShow] = useState(false);
  const [desc, setDesc] = useState(card.description);
  const [due, setDue] = useState(card.dueDate);
  const [label, setLabel] = useState(card.label);

  return (
    <div
      style={{
        background: "#fff",
        margin: "6px",
        padding: "10px",
        borderRadius: "8px",
      }}
      onClick={() => setShow(true)}
    >
      {card.text}
      <button onClick={(e) => { e.stopPropagation(); deleteCard(); }}>❌</button>

      {show && (
        <div style={{ background: "#000000aa", position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
          <div style={{ background: "#fff", margin: "100px auto", padding: "20px", width: "300px" }}>
            <h3>{card.text}</h3>

            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />

            <input
              placeholder="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />

            <button onClick={() => setShow(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;