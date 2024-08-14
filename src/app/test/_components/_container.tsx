import { useNode } from '@craftjs/core';

export const Container = ({
  background,
  padding = 0,
  children,
}: {
  background: string;
  padding: number;
  children?: React.ReactNode;
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) connect(drag(ref));
      }}
      className="m-2"
      style={{ background, padding: `${padding}px` }}
    >
      {children}
    </div>
  );
};
