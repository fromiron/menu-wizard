import { Element } from '@craftjs/core';
import { nanoid } from 'nanoid';
import { Container } from './_container';
import { Text } from './_text';

export const Card = ({
  background,
  padding = 20,
}: {
  background: string;
  padding: number;
}) => {
  return (
    <Element
      is={Container}
      id={`container-${nanoid()}`}
      background={background}
      padding={padding}
      canvas
    >
      <Element is={Text} id={`text-${nanoid()}`} text="Title" fontSize={20} />
      <Element
        is={Text}
        id={`text-${nanoid()}`}
        text="Subtitle"
        fontSize={15}
      />
    </Element>
  );
};
