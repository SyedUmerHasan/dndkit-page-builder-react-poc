import React, { Children, useState } from "react";
import { NumlProvider, El } from "@numl-react/core";
import { horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: props.id,
    data: {
      row: props.row,
      column: props.column
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <El.Card cursor="pointer">{props.children || "Hello I am umer"}</El.Card>
    </div>
  );
}
// const SortableItem = React.memo(Item);

export function SortableArray(props) {
  return (
    <SortableContext
      items={props.items}
      strategy={horizontalListSortingStrategy}
    >
      <El.Flex gap="2x" flow="row">
        {React.Children.toArray(
          props.items.map((eachItem, index) => {
            // console.log("start");
            return (
              <SortableItem id={eachItem} row={props.row} column={index}>
                {eachItem}
              </SortableItem>
            );
          })
        )}
      </El.Flex>
    </SortableContext>
  );
}

export default function App() {
  const [items, setItems] = useState([["1", "2", "3"], ["4"], ["5", "6"]]);

  function handleDragEnd(event) {
    const { active, over } = event;
    const activeData = active.data.current;
    const overData = over.data.current;
    if (active.id !== over.id && activeData && overData) {
      // console.log("activeData", activeData);
      // console.log("overData", overData);
      setItems((items) => {
        const oldIndex = items[activeData.row][activeData.column];
        const newIndex = items[overData.row][overData.column];
        const from = removeAtIndex(items[activeData.row], activeData.column);
        // const to = insertAtIndex(items[overData.row], overData.column);
        const to = insertAtIndex(
          items[activeData.row] === items[overData.row]
            ? from
            : items[overData.row],
          overData.column,
          oldIndex
        );
        items[activeData.row] = from;
        items[overData.row] = to;
        console.log(items);
        return items;
      });
    }
  }
  let mainArrayIndex = 0;
  return (
    <NumlProvider>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <El.Flex gap="2x" flow="column">
            {items.map((eachItem, index) => {
              // console.log({
              //   id: eachItem,
              //   row: eachItem,
              //   column: eachItem
              // });
              return <SortableArray items={eachItem} row={mainArrayIndex++} />;
            })}
          </El.Flex>
        </SortableContext>
      </DndContext>
    </NumlProvider>
  );
}

export const removeAtIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const insertAtIndex = (array, index, item) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};
