import { Droppable, Draggable } from "@hello-pangea/dnd";

function List({
  list,
  addCard,
  deleteCard,
  deleteList,
  editList,
  search,
  editCard,
}) {
  return (
    <div
      style={{
        background: "#e0f2fe",
color: "#0f172a",
        padding: "10px",
        minWidth: "250px",
        borderRadius: "8px",
      }}
    >
      <h3>{list.title}</h3>

      <button onClick={() => addCard(list.id)}>+ Add Card</button>
      <button onClick={() => deleteList(list.id)}>Delete</button>
      <button onClick={() => editList(list.id)}>Edit</button>

      {/* 🔥 DRAG AREA */}
      <Droppable droppableId={list.id.toString()}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {(list.cards || [])
              .filter((card) =>
                card.text.toLowerCase().includes(search.toLowerCase())
              )
              .map((card, index) => (
                <Draggable
                  key={card.id.toString()}
                  draggableId={card.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        marginTop: "10px",
                        padding: "8px",
                        background: "#ffffff",
color: "#0f172a",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <span>{card.text}</span>

                      <div>
                        <button
                          onClick={() =>
                            editCard(card.id, card.text)
                          }
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() =>
                            deleteCard(list.id, card.id)
                          }
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default List;