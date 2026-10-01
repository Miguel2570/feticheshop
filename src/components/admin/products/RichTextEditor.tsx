// components/admin/products/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreve a descrição do produto...",
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // ← importante para Next.js SSR
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        // Remove coisas que não queres
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-pink-600 underline hover:text-pink-700",
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-zinc-900",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Atualiza o conteúdo quando o `value` muda de fora
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rounded-xl border-2 border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">
        A carregar editor...
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border-2 border-zinc-200 bg-white transition ${
        editor.isFocused ? "border-pink-500 ring-2 ring-pink-200" : ""
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Negrito (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Itálico (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-zinc-300" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().setParagraph().run()
          }
          isActive={editor.isActive("paragraph")}
          title="Parágrafo normal"
        >
          <Type size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Subtítulo"
        >
          <Heading2 size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Título pequeno"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-zinc-300" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          isActive={editor.isActive("bulletList")}
          title="Lista com pontos"
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          isActive={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-zinc-300" />

        <ToolbarButton
          onClick={() => {
            const url = window.prompt("URL do link:");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          isActive={editor.isActive("link")}
          title="Inserir link"
        >
          <LinkIcon size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-zinc-300" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Desfazer (Ctrl+Z)"
        >
          <Undo size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Refazer (Ctrl+Shift+Z)"
        >
          <Redo size={16} />
        </ToolbarButton>
      </div>

      {/* ÁREA DE EDIÇÃO */}
      <EditorContent editor={editor} />
    </div>
  );
}

// ─── Botão da toolbar ─────────────────────────────────────
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex h-8 w-8 items-center justify-center
        rounded-lg
        transition-all duration-150
        disabled:opacity-30 disabled:cursor-not-allowed
        cursor-pointer
        ${
          isActive
            ? "bg-pink-500 text-white shadow-sm"
            : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
        }
      `}
    >
      {children}
    </button>
  );
}