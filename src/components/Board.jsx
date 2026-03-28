import { useEffect, useState } from "react";
import List from "./List";
import { DragDropContext } from "@hello-pangea/dnd";

function Board() {
  const [lists, setLists] = useState([]);
  const [search, setSearch] = useState("");

  // ================= FETCH =================
  const fetchLists = async () => {
    const res = await fetch("http://localhost:5001/lists");
    const data = await res.json();

    const listsWithCards = await Promise.all(
      data.map(async (list) => {
        const resCards = await fetch(
          `http://localhost:5001/cards/${list.id}`
        );
        const cards = await resCards.json();

        return {
          ...list,
          cards: cards || [],
        };
      })
    );

    setLists(listsWithCards);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // ================= DRAG =================
  const handleDragEnd = (result) => {
  const { source, destination } = result;

  if (!destination) return;

  const sourceListIndex = lists.findIndex(
    (l) => l.id.toString() === source.droppableId
  );

  const destListIndex = lists.findIndex(
    (l) => l.id.toString() === destination.droppableId
  );

  const sourceList = lists[sourceListIndex];
  const destList = lists[destListIndex];

  const sourceCards = [...(sourceList.cards || [])];

  // 🔥 SAME LIST DRAG
  if (source.droppableId === destination.droppableId) {
    const [movedCard] = sourceCards.splice(source.index, 1);
    sourceCards.splice(destination.index, 0, movedCard);

    const updatedLists = [...lists];
    updatedLists[sourceListIndex] = {
      ...sourceList,
      cards: sourceCards,
    };

    setLists(updatedLists);
    return;
  }

  // 🔥 DIFFERENT LIST DRAG
  const destCards = [...(destList.cards || [])];

  const [movedCard] = sourceCards.splice(source.index, 1);
  destCards.splice(destination.index, 0, movedCard);

  const updatedLists = [...lists];

  updatedLists[sourceListIndex] = {
    ...sourceList,
    cards: sourceCards,
  };

  updatedLists[destListIndex] = {
    ...destList,
    cards: destCards,
  };

  setLists(updatedLists);
};

  // ================= LIST =================
  const addList = async () => {
    const title = prompt("Enter list title");
    if (!title) return;

    await fetch("http://localhost:5001/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    fetchLists();
  };

  const deleteList = async (id) => {
    await fetch(`http://localhost:5001/lists/${id}`, {
      method: "DELETE",
    });

    fetchLists();
  };

  const editList = (id) => {
    const title = prompt("New title");
    if (!title) return;

    setLists(
      lists.map((l) => (l.id === id ? { ...l, title } : l))
    );
  };

  // ================= CARD =================
  const addCard = async (listId) => {
    const text = prompt("Card title");
    if (!text) return;

    await fetch("http://localhost:5001/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, list_id: listId }),
    });

    fetchLists();
  };

  const deleteCard = async (listId, cardId) => {
    await fetch(`http://localhost:5001/cards/${cardId}`, {
      method: "DELETE",
    });

    fetchLists();
  };

  const editCard = async (cardId, oldText) => {
    const newText = prompt("Edit card", oldText);
    if (!newText) return;

    await fetch(`http://localhost:5001/cards/${cardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });

    fetchLists();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Trello Clone</h1>

      <input
        placeholder="Search cards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "20px" }}>
          {lists.map((list) => (
            <List
              key={list.id}
              list={list}
              addCard={addCard}
              deleteCard={deleteCard}
              deleteList={deleteList}
              editList={editList}
              editCard={editCard}
              search={search}
            />
          ))}

          <button onClick={addList}>+ Add List</button>
        </div>
      </DragDropContext>
    </div>
  );
}

export default Board;