import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from "lucide-react";
import { useEditor } from "novel";
import { getPrevText } from "novel/utils";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

const options = [
  {
    value: "improve",
    label: "Melhore a escrita",
    icon: RefreshCcwDot,
  },

  {
    value: "fix",
    label: "Corrigir gramática",
    icon: CheckCheck,
  },
  {
    value: "shorter",
    label: "Faça mais curto",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Faça mais longo",
    icon: WrapText,
  },
];

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void;
}

const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor();

  return (
    <>
      <CommandGroup heading="Editar ou revisar seleção">
        {options.map((option) => (
          <CommandItem
            onSelect={(value) => {
              const slice = editor.state.selection.content();
              const text = editor.storage.markdown.serializer.serialize(
                slice.content,
              );
              onSelect(text, value);
            }}
            className="flex gap-2 px-4"
            key={option.value}
            value={option.value}
          >
            <option.icon className="h-4 w-4 text-purple-500" />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Use a IA para criar mais">
        <CommandItem
          onSelect={() => {
            const pos = editor.state.selection.from;

            const text = getPrevText(editor, pos);
            onSelect(text, "continue");
          }}
          value="continue"
          className="gap-2 px-4"
        >
          <StepForward className="h-4 w-4 text-purple-500" />
          Continuar escrevendo
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default AISelectorCommands;
