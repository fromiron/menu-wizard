import { useEditor } from '@craftjs/core';
import { Container } from './_container';
import { Card } from './_card';
import { Text } from './_text';

export const Toolbox = () => {
  const { actions, query, enabled, connectors } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <div className="p-4">
      <div className="">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) =>
              actions.setOptions(
                (options) => (options.enabled = e.target.checked),
              )
            }
            className="mr-2"
          />
          활성화
        </label>
        <button
          className="rounded bg-blue-500 p-2 text-white"
          onClick={() => console.log(query.serialize())}
        >
          JSON
        </button>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <button
          ref={(ref: HTMLButtonElement | null) => {
            if (ref) {
              connectors.create(ref, <Text text="TEXT" fontSize={16} />);
            }
          }}
          className="rounded bg-blue-500 p-2 text-white"
        >
          Text
        </button>
        <button
          ref={(ref: HTMLButtonElement | null) => {
            if (ref) {
              connectors.create(
                ref,
                <Container background="#eee" padding={20} />,
              );
            }
          }}
          className="rounded bg-blue-500 p-2 text-white"
        >
          Container
        </button>
        <button
          ref={(ref: HTMLButtonElement | null) => {
            if (ref) {
              connectors.create(ref, <Card background="#fff" padding={20} />);
            }
          }}
          className="rounded bg-blue-500 p-2 text-white"
        >
          Card
        </button>
      </div>
    </div>
  );
};
