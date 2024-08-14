import { useNode, useEditor } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';

export type TextProps = {
  fontSize: number;
  textAlign: string;
  fontWeight: string;
  color: Record<'r' | 'g' | 'b' | 'a', string>;
  shadow: number;
  text: string;
  margin: [number, number, number, number];
};

export const Text = ({
  fontSize,
  textAlign,
  fontWeight,
  color = { r: '92', g: '90', b: '90', a: '1' },
  shadow,
  text = '',
  margin = [0, 0, 0, 0],
}: Partial<TextProps>) => {
  const {
    connectors: { connect },
    setProp,
  } = useNode();
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  return (
    <ContentEditable
      innerRef={connect}
      html={text}
      disabled={!enabled}
      onChange={(e) => {
        setProp((prop) => (prop.text = e.target.value), 500);
      }}
      tagName="h2"
      style={{
        width: '100%',
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        color: `rgba(${Object.values(color).join(',')})`,
        fontSize: `${fontSize}px`,
        textShadow: `0px 0px 2px rgba(0,0,0,${(shadow ?? 0) / 100})`,
        fontWeight,
        textAlign,
      }}
    />
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    fontSize: '15',
    textAlign: 'left',
    fontWeight: '500',
    color: { r: 92, g: 90, b: 90, a: 1 },
    margin: [0, 0, 0, 0],
    shadow: 0,
    text: 'Text',
  },
};
