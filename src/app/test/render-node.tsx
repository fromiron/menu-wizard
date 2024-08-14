import { useNode, useEditor, type Node, type NodeData } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  forwardRef,
} from 'react';
import ReactDOM from 'react-dom';
import { IoMove } from 'react-icons/io5';
import { FaArrowUp } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';

const Btn = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));
Btn.displayName = 'Btn';

const IndicatorDiv = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ children, ...props }, ref) => (
  <div
    ref={ref}
    className="fixed flex -translate-y-full items-center justify-center rounded-t-md bg-primary px-4 py-2 text-white"
    {...props}
  >
    {children}
  </div>
));
IndicatorDiv.displayName = 'IndicatorDiv';

interface ExtendedNodeData extends NodeData {
  custom?: {
    displayName?: string;
  };
}

const useNodeInfo = () => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node: Node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name:
      node.data.displayName ??
      (node.data as ExtendedNodeData)?.custom?.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
  }));

  return {
    id,
    isActive,
    isHover,
    dom,
    name,
    moveable,
    deletable,
    drag,
    parent,
    actions,
  };
};

interface NodeControlsProps {
  name: string;
  moveable: boolean;
  deletable: boolean;
  id: string;
  parent: string | null;
  drag: (element: HTMLElement | null) => void;
  actions: {
    selectNode: (id: string) => void;
    delete: (id: string) => void;
  };
}
const NodeControls = ({
  name,
  moveable,
  deletable,
  id,
  parent,
  drag,
  actions,
}: NodeControlsProps) => (
  <div className="flex gap-x-2">
    <h2 className="mr-4 flex-1">{name}</h2>
    {moveable && (
      <Btn className="cursor-move" ref={drag}>
        <IoMove />
      </Btn>
    )}
    {id !== ROOT_NODE && (
      <Btn
        className="cursor-pointer"
        onClick={() => parent !== null && actions.selectNode(parent)}
      >
        <FaArrowUp />
      </Btn>
    )}
    {deletable && (
      <Btn
        className="cursor-pointer"
        onMouseDown={(e: React.MouseEvent) => {
          e.stopPropagation();
          actions.delete(id);
        }}
      >
        <MdDelete />
      </Btn>
    )}
  </div>
);

export const RenderNode = ({ render }: { render: React.ReactNode }) => {
  const {
    id,
    isActive,
    isHover,
    dom,
    name,
    moveable,
    deletable,
    drag,
    parent,
    actions,
  } = useNodeInfo();

  const [container, setContainer] = useState<Element | null>(null);
  useEffect(() => {
    setContainer(document.body);
  }, []);

  useEffect(() => {
    if (dom) {
      dom.classList.toggle('component-selected', isActive || isHover);
    }
  }, [dom, isActive, isHover]);

  return (
    <>
      {isHover && isActive && container && dom && (
        <IndicatorPortal dom={dom} container={container}>
          <NodeControls
            name={name}
            moveable={moveable}
            deletable={deletable}
            id={id}
            parent={parent}
            drag={(ref) => ref && drag(ref)}
            actions={actions}
          />
        </IndicatorPortal>
      )}
      {render}
    </>
  );
};

interface IndicatorPortalProps {
  children: React.ReactNode;
  dom: HTMLElement;
  container: Element;
}

const IndicatorPortal = ({
  children,
  dom,
  container,
}: IndicatorPortalProps) => {
  const currentRef = useRef<HTMLDivElement | null>(null);
  const getPos = useCallback((dom: HTMLElement) => {
    const { top, left, bottom } = dom?.getBoundingClientRect() || {};
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  return ReactDOM.createPortal(
    <IndicatorDiv
      ref={currentRef}
      style={{
        left: getPos(dom).left,
        top: getPos(dom).top,
        zIndex: 9999,
      }}
    >
      {children}
    </IndicatorDiv>,
    container,
  );
};
