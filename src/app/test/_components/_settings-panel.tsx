import React from 'react';
import { useEditor } from '@craftjs/core';

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;
    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId]?.data.name,
        settings: state.nodes[currentNodeId]?.related?.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }
    return { selected };
  });

  return selected ? (
    <div className="mt-4 bg-gray-100 p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-lg">선택됨</span>
          <span className="rounded bg-blue-500 px-2 py-1 text-white">
            {selected.name}
          </span>
        </div>
      </div>
      {selected.settings && React.createElement(selected.settings)}
      {selected.isDeletable && (
        <button
          className="mt-4 rounded bg-red-500 p-2 text-white"
          onClick={() => actions.delete(selected.id)}
        >
          삭제
        </button>
      )}
    </div>
  ) : null;
};
