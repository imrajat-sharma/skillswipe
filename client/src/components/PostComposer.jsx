import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, ListChecks, X, Type } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./Button";

const postModes = [
  { value: "text", label: "Text", icon: Type },
  { value: "image", label: "Image", icon: ImagePlus },
  { value: "poll", label: "Poll", icon: ListChecks },
];

const createEmptyOptions = () => ["", ""];
const MotionForm = motion.form;
const MotionDiv = motion.div;

export default function PostComposer({ onCreate, submitting }) {
  const [type, setType] = useState("text");
  const [formatting, setFormatting] = useState("plain");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [question, setQuestion] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [options, setOptions] = useState(createEmptyOptions);
  const [files, setFiles] = useState([]);
  const [localError, setLocalError] = useState("");
  const previewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const fileNames = useMemo(() => files.map((file) => file.name).join(", "), [files]);

  const resetForm = () => {
    setContent("");
    setCaption("");
    setQuestion("");
    setClosesAt("");
    setOptions(createEmptyOptions());
    setFiles([]);
    setFormatting("plain");
    setType("text");
    setLocalError("");
  };

  const handleModeChange = (nextType) => {
    setType(nextType);
    setLocalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    const trimmedContent = content.trim();
    const trimmedCaption = caption.trim();
    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map((option) => option.trim()).filter(Boolean);

    if (type === "text" && !trimmedContent) {
      setLocalError("Text posts need content.");
      return;
    }

    if (type === "image" && !files.length) {
      setLocalError("Image posts need at least one image.");
      return;
    }

    if (type === "poll") {
      if (!trimmedQuestion || trimmedOptions.length < 2) {
        setLocalError("Polls need a question and at least two options.");
        return;
      }
    }

    await onCreate({
      type,
      formatting,
      content: trimmedContent,
      caption: trimmedCaption,
      question: trimmedQuestion,
      closesAt: closesAt || null,
      options: trimmedOptions,
      files,
      resetForm,
      setLocalError,
    });
  };

  return (
    <MotionForm
      onSubmit={handleSubmit}
      className="glass-panel rounded-[1.8rem] p-4 md:p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="section-label">Create post</div>
          <h2 className="h3 mt-2.5">Share a text update, image drop, or quick poll</h2>
        </div>

        <div className="chip-group">
          {postModes.map(({ value, label, icon }) => {
            const ModeIcon = icon;

            return (
            <button
              key={value}
              type="button"
              onClick={() => handleModeChange(value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                type === value
                  ? "bg-gradient-to-br from-[#fb7185] to-[#fb923c] text-white shadow-[var(--shadow-soft)]"
                  : "bg-[var(--surface-subtle)] text-[var(--text-muted)]"
              }`}
            >
              <ModeIcon size={14} />
              {label}
            </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-3.5">
        <AnimatePresence mode="wait">
          {type === "text" ? (
            <MotionDiv
              key="text"
              className="grid gap-3"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Formatting</label>
                <select className="select" value={formatting} onChange={(event) => setFormatting(event.target.value)}>
                  <option value="plain">Plain text</option>
                  <option value="markdown">Markdown</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">What are you building?</label>
                <textarea
                  className="textarea"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Share a milestone, a question, or a quick build note."
                />
              </div>
            </MotionDiv>
          ) : null}

          {type === "image" ? (
            <MotionDiv
              key="image"
              className="grid gap-3"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Caption</label>
                <textarea
                  className="textarea"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Tell people what these images show."
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 4))}
                  className="input"
                />
                {previewUrls.length ? (
                  <div className={`grid gap-2 ${previewUrls.length > 1 ? "sm:grid-cols-2" : ""}`}>
                    {previewUrls.map((url, index) => (
                      <div key={url} className="relative overflow-hidden rounded-[1.1rem] border border-[var(--border-soft)]">
                        <img
                          src={url}
                          alt={`Selected image ${index + 1}`}
                          className="h-36 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                          className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                {fileNames ? <p className="text-xs text-[var(--text-muted)]">{fileNames}</p> : null}
              </div>
            </MotionDiv>
          ) : null}

          {type === "poll" ? (
            <MotionDiv
              key="poll"
              className="grid gap-3"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
            >
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Question</label>
                <input
                  className="input"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="What should the community vote on?"
                />
              </div>
              <div className="grid gap-3">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Options</label>
                {options.map((option, index) => (
                  <input
                    key={`${index}-${type}`}
                    className="input"
                    value={option}
                    onChange={(event) =>
                      setOptions((current) =>
                        current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
                      )
                    }
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
                {options.length < 4 ? (
                  <button
                    type="button"
                    onClick={() => setOptions((current) => [...current, ""])}
                    className="justify-self-start rounded-full bg-[var(--surface-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)]"
                  >
                    Add option
                  </button>
                ) : null}
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Closes at</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={closesAt}
                  onChange={(event) => setClosesAt(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Caption</label>
                <textarea
                  className="textarea"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Optional context for the poll."
                />
              </div>
            </MotionDiv>
          ) : null}
        </AnimatePresence>
      </div>

      {localError ? <div className="status-message error mt-4">{localError}</div> : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
        <p className="text-xs text-[var(--text-muted)]">Posts are visible to the SkillSwipe community feed.</p>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={resetForm} disabled={submitting}>
            Clear
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Publish post
          </Button>
        </div>
      </div>
    </MotionForm>
  );
}
