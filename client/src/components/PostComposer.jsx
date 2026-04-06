import { ImagePlus, ListChecks, Type } from "lucide-react";
import { createElement, useMemo, useState } from "react";
import { Button } from "./Button";

const postModes = [
  { value: "text", label: "Text", icon: Type },
  { value: "image", label: "Image", icon: ImagePlus },
  { value: "poll", label: "Poll", icon: ListChecks },
];

export default function PostComposer({ onCreate, submitting }) {
  const [type, setType] = useState("text");
  const [formatting, setFormatting] = useState("plain");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [files, setFiles] = useState([]);
  const [localError, setLocalError] = useState("");

  const fileNames = useMemo(() => files.map((file) => file.name).join(", "), [files]);

  const resetForm = () => {
    setContent("");
    setCaption("");
    setQuestion("");
    setOptions(["", ""]);
    setFiles([]);
    setFormatting("plain");
    setType("text");
    setLocalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    const trimmedOptions = options.map((option) => option.trim()).filter(Boolean);
    if (type === "text" && !content.trim()) {
      setLocalError("Text posts need content.");
      return;
    }

    if (type === "image" && !files.length) {
      setLocalError("Image posts need at least one image.");
      return;
    }

    if (type === "poll" && (!question.trim() || trimmedOptions.length < 2)) {
      setLocalError("Polls need a question and at least two options.");
      return;
    }

    await onCreate({
      type,
      formatting,
      content,
      caption,
      question,
      options: trimmedOptions,
      files,
      resetForm,
      setLocalError,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="page-surface rounded-[1.6rem] p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="section-label">Community feed</div>
          <h2 className="h3 mt-2.5 text-slate-900">Share an update, poll, or image drop</h2>
        </div>
        <div className="chip-group">
          {postModes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                type === value ? "bg-gradient-to-br from-primary-600 to-secondary-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {createElement(Icon, { size: 14 })}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3.5">
        {type === "text" && (
          <>
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-600">Formatting</label>
              <select className="select" value={formatting} onChange={(event) => setFormatting(event.target.value)}>
                <option value="plain">Plain text</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-600">What are you building?</label>
              <textarea
                className="textarea"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Share a lesson, ask for collaborators, or post a quick builder update."
              />
            </div>
          </>
        )}

        {type === "image" && (
          <>
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-600">Caption</label>
              <textarea
                className="textarea"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Tell people what these images show."
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-600">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 4))}
                className="input"
              />
              {fileNames ? <p className="text-xs text-slate-500">{fileNames}</p> : null}
            </div>
          </>
        )}

        {type === "poll" && (
          <>
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-600">Question</label>
              <input
                className="input"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What should the community vote on?"
              />
            </div>
            <div className="grid gap-3">
              <label className="text-xs font-semibold text-slate-600">Options</label>
              {options.map((option, index) => (
                <input
                  key={`${index}-${type}`}
                  className="input"
                  value={option}
                  onChange={(event) =>
                    setOptions((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))
                  }
                  placeholder={`Option ${index + 1}`}
                />
              ))}
              {options.length < 4 ? (
                <button
                  type="button"
                  onClick={() => setOptions((current) => [...current, ""])}
                  className="justify-self-start rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  Add option
                </button>
              ) : null}
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold text-slate-600">Caption</label>
              <textarea
                className="textarea"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Optional context for the poll."
              />
            </div>
          </>
        )}
      </div>

      {localError ? <div className="status-message error mt-4">{localError}</div> : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
        <p className="text-xs text-slate-500">Posts are visible to the SkillSwipe community feed.</p>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={resetForm}>
            Clear
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Publish post
          </Button>
        </div>
      </div>
    </form>
  );
}
