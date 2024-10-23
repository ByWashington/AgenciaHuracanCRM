'use client'

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
} from 'novel'
import { ImageResizer, handleCommandNavigation } from 'novel/extensions'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { defaultExtensions } from '@/components/editor/extensions'
import { ColorSelector } from '@/components/editor/selectors/color-selector'
import { LinkSelector } from '@/components/editor/selectors/link-selector'
import { NodeSelector } from '@/components/editor/selectors/node-selector'
import { MathSelector } from '@/components/editor/selectors/math-selector'
import { Separator } from '@/components/ui/separator'

import { handleImageDrop, handleImagePaste } from 'novel/plugins'
import GenerativeMenuSwitch from './generative/generative-menu-switch'
import { uploadFn } from './image-upload'
import { TextButtons } from '@/components/editor/selectors/text-buttons'
import {
  slashCommand,
  suggestionItems,
} from '@/components/editor/slash-command'

const hljs = require('highlight.js')

const extensions = [...defaultExtensions, slashCommand]

interface TailwindAdvancedEditorProps {
  initialValue?: string
  onChange: (content: string) => void
}

const TailwindAdvancedEditor: React.FC<TailwindAdvancedEditorProps> = ({
  initialValue,
  onChange,
}) => {
  const [charsCount, setCharsCount] = useState()
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openAI, setOpenAI] = useState(false)

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      setCharsCount(editor.storage.characterCount.words())
    },
    500
  )

  return (
    <div className='relative w-full'>
      <div className='flex absolute right-5 top-5 z-10 gap-2'>
        <div
          className={
            charsCount
              ? 'rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground'
              : 'hidden'
          }
        >
          {charsCount} Palavras
        </div>
      </div>
      <EditorRoot>
        <EditorContent
          immediatelyRender={true}
          {...(initialValue && { initialContent: JSON.parse(initialValue) })}
          extensions={extensions}
          className='relative min-h-[500px] w-full border-muted bg-background sm:rounded-lg sm:border sm:shadow-lg'
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                'prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full',
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor)
            onChange(JSON.stringify(editor.getJSON()))
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
            <EditorCommandEmpty className='px-2 text-muted-foreground'>
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command(val)}
                  className='flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent'
                  key={item.title}
                >
                  <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>
                    {item.icon}
                  </div>
                  <div>
                    <p className='font-medium'>{item.title}</p>
                    <p className='text-xs text-muted-foreground'>
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation='vertical' />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation='vertical' />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation='vertical' />
            <MathSelector />
            <Separator orientation='vertical' />
            <TextButtons />
            <Separator orientation='vertical' />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  )
}

export default TailwindAdvancedEditor
