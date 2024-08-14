'use client';
import { Editor, Frame, Element, type Resolver } from '@craftjs/core';
import { nanoid } from 'nanoid';
import { RenderNode } from './render-node';
import { Container } from './_components/_container';
import { Card } from './_components/_card';
import { SettingsBar } from './_components/_settings-bar';
import { Text } from './_components/_text';
import { Toolbox } from './_components/_toolbox';
import { SettingsPanel } from './_components/_settings-panel';

export const resolver: Resolver = {
  Text,
  Container,
  Card,
};
const EditorContent = () => (
  <Frame>
    <Element
      is={Container}
      id={`container-${nanoid()}`}
      padding={5}
      background="#eee"
      canvas
    >
      <Card background="#fff" padding={20} />
    </Element>
  </Frame>
);

const Sidebar = () => (
  <div className="w-1/4 bg-gray-100 p-4">
    <SettingsBar />
    <Toolbox />
    <SettingsPanel />
  </div>
);

export default function Builder() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-2xl">간단한 페이지 에디터</h1>
      <Editor resolver={resolver} onRender={RenderNode}>
        <div className="flex">
          <div className="w-3/4 p-4">
            <EditorContent />
          </div>
          <Sidebar />
        </div>
      </Editor>
    </div>
  );
}
