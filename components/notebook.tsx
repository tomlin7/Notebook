"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generatePodcast, generateSummary } from "@/lib/gemini";
import { useChatStore } from "@/lib/store";
import { FileText, Loader2, Upload } from "lucide-react";
import "pdfjs-dist/build/pdf.worker.mjs";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ChatPanel } from "./chat/panel";
import { PodcastPlayer } from "./podcast";
import { ScrollArea } from "./ui/scroll-area";

export function Notebook() {
  const [files, setFiles] = useState<Array<{ name: string; content: string }>>(
    []
  );
  const [summaries, setSummaries] = useState<
    Array<{
      name: string;
      summary: string;
      audio?: string;
      isGeneratingPodcast?: boolean;
    }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const { createSession } = useChatStore();
  const { toast } = useToast();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [summaries]);

  const generatePodcastForSummary = async (
    fileName: string,
    summary: string
  ) => {
    try {
      setSummaries((prev) => {
        const existing = prev.findIndex((s) => s.name === fileName);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = {
            ...updated[existing],
            isGeneratingPodcast: true,
          };
          return updated;
        }
        return prev;
      });

      const audio = await generatePodcast(summary, (audio) => {
        setSummaries((prev) => {
          const existing = prev.findIndex((s) => s.name === fileName);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = {
              ...updated[existing],
              audio,
              isGeneratingPodcast: false,
            };
            return updated;
          }
          return prev;
        });
      });
      return audio;
    } catch (error) {
      console.error("Error generating podcast:", error);
      setSummaries((prev) => {
        const existing = prev.findIndex((s) => s.name === fileName);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = {
            ...updated[existing],
            isGeneratingPodcast: false,
          };
          return updated;
        }
        return prev;
      });
      toast({
        title: "Podcast Generation Failed",
        description:
          "Failed to generate the podcast. The summary is still available.",
        variant: "destructive",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    onDrop: async (acceptedFiles) => {
      setIsProcessing(true);

      for (const file of acceptedFiles) {
        let text = "";

        if (file.type === "application/pdf") {
          const { getDocument } = await import("pdfjs-dist");
          try {
            const pdf = await getDocument(await file.arrayBuffer()).promise;
            const numPages = pdf.numPages;
            for (let i = 1; i <= numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map((item: any) => item.str).join(" ");
            }
          } catch (error) {
            console.error("Error extracting text from PDF:", error);
          }
        } else {
          text = await file.text();
        }

        setFiles((prev) => [...prev, { name: file.name, content: text }]);

        try {
          const summary = await generateSummary(text, (summary) => {
            setSummaries((prev) => {
              const existing = prev.findIndex((s) => s.name === file.name);
              if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = {
                  name: file.name,
                  summary,
                };
                return updated;
              }
              return [...prev, { name: file.name, summary }];
            });
          });

          generatePodcastForSummary(file.name, summary);

          createSession(file.name, text);
          setActiveFile(file.name);
        } catch (error) {
          console.error("Error processing file:", error);
          toast({
            title: "Processing Error",
            description: "Failed to process the document. Please try again.",
            variant: "destructive",
          });
        }
      }

      setIsProcessing(false);
    },
  });

  const activeSummary = activeFile
    ? summaries.find((s) => s.name === activeFile)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-4 md:col-span-1 border-border bg-card">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Documents
        </h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag & drop PDF or Text files here, or click to select
          </p>
        </div>

        <div className="h-[300px] mt-4 space-y-2 overflow-hidden">
          <div className="space-y-1">
            {files.map((file, index) => (
              <Button
                key={index}
                variant={activeFile === file.name ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 px-3"
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">{file.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-4 md:col-span-3 border-border bg-card">
        {isProcessing ? (
          <div className="flex items-center justify-center h-[400px] text-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Processing documents...</p>
          </div>
        ) : activeFile ? (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-4">
              <ScrollArea ref={scrollRef} className="flex-1 p-4 h-[600px]">
                {activeSummary && (
                  <PodcastPlayer
                    audioSrc={activeSummary.audio || ""}
                    isLoading={activeSummary.isGeneratingPodcast}
                  />
                )}
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, remarkGfm]}
                  components={{
                    // tailwind
                    h1: ({ children }) => (
                      <h1 className="font-bold mb-4 text-2xl">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-bold mb-3 text-xl">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-bold mb-2 text-lg">{children}</h3>
                    ),
                    code: ({ children }) => (
                      <code className="bg-zinc-500 px-1.5 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    p: ({ children }) => <p className="mb-4">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-disc ml-6 mb-4">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-6 mb-4">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-muted pl-4 italic mb-4">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {activeSummary?.summary || "No summary available"}
                </ReactMarkdown>
              </ScrollArea>
              {/* </div> */}
            </TabsContent>

            <TabsContent value="chat" className="mt-4">
              <ChatPanel sessionId={activeFile} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            Select a document to view its summary and chat
          </div>
        )}
      </Card>
    </div>
  );
}
