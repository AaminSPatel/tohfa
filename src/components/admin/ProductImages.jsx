"use client";
import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiRefreshCw, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { FormAlert } from "@/components/ui/Form";

const btn = "grid h-9 w-9 place-items-center rounded bg-paper/95 text-ink shadow-soft hover:bg-white disabled:opacity-40";

/**
 * Image manager for the product form: upload to Cloudinary, replace, reorder, remove.
 * `sessionUploads` (a Set in a ref) tracks images uploaded in this editing session that aren't saved yet,
 * so removing them purges them from Cloudinary immediately. Saved images are deleted when you press Save.
 */
export default function ProductImages({ images, onChange, ready, sessionUploads }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [manual, setManual] = useState("");
  const replaceIndex = useRef(null);
  const addInput = useRef(null);
  const replaceInput = useRef(null);

  const purge = (url) =>
    fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) }).catch(() => {});

  async function upload(fileList, idx = null) {
    const files = [...fileList];
    if (!files.length) return;
    setBusy(true); setError("");
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) { setError(data?.message || "Upload failed."); return; }
      data.urls.forEach((u) => sessionUploads.current.add(u));
      if (idx === null) onChange([...images, ...data.urls]);
      else {
        const old = images[idx];
        onChange(images.map((u, i) => (i === idx ? data.urls[0] : u)));
        if (sessionUploads.current.has(old)) { sessionUploads.current.delete(old); purge(old); } // unsaved: delete now
        // saved images are deleted from Cloudinary when you save the product
      }
    } catch { setError("Couldn't reach the server."); }
    finally { setBusy(false); }
  }

  function remove(i) {
    const url = images[i];
    if (sessionUploads.current.has(url)) { sessionUploads.current.delete(url); purge(url); }
    onChange(images.filter((_, j) => j !== i));
  }
  const move = (i, d) => { const a = [...images]; [a[i], a[i + d]] = [a[i + d], a[i]]; onChange(a); };

  function addManual() {
    const v = manual.trim();
    if (!v) return;
    if (!(v.startsWith("/") || /^https:\/\/(res\.cloudinary\.com|images\.unsplash\.com)\//.test(v))) { setError("Use a path like /images/products/x.jpg or an https://res.cloudinary.com/ link."); return; }
    setError(""); onChange([...images, v]); setManual("");
  }

  return (
    <div>
      <FormAlert>{error}</FormAlert>
      {images.length > 0 && (
        <ul className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((src, i) => (
            <li key={src + i} className="space-y-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded border border-line bg-sand">
                {/* plain <img>: admin may preview any host before it's allow-listed for the storefront */}
                <img src={src} alt={`Product photo ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                {i === 0 && <span className="absolute left-0 top-2 rounded-r bg-ink px-2 py-0.5 text-xs text-paper">Main photo</span>}
                {sessionUploads.current.has(src) && <span className="absolute bottom-2 left-2 rounded bg-marigold px-2 py-0.5 text-xs">New</span>}
              </div>
              <div className="flex gap-1.5">
                <button type="button" className={btn + " border border-line"} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`}><FiArrowLeft /></button>
                <button type="button" className={btn + " border border-line"} onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label={`Move photo ${i + 1} later`}><FiArrowRight /></button>
                <button type="button" className={btn + " border border-line"} disabled={!ready || busy} onClick={() => { replaceIndex.current = i; replaceInput.current?.click(); }} aria-label={`Replace photo ${i + 1}`} title="Replace"><FiRefreshCw /></button>
                <button type="button" className={btn + " border border-line text-rani"} onClick={() => remove(i)} aria-label={`Remove photo ${i + 1}`} title="Remove"><FiTrash2 /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input ref={replaceInput} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" tabIndex={-1}
        onChange={(e) => { upload(e.target.files, replaceIndex.current); e.target.value = ""; }} />
      <input ref={addInput} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" tabIndex={-1}
        onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
      <button type="button" disabled={!ready || busy} onClick={() => addInput.current?.click()}
        className="flex w-full flex-col items-center gap-2 rounded border-2 border-dashed border-ink/30 px-4 py-8 text-center text-ink-soft transition-colors hover:border-rani hover:text-rani disabled:cursor-not-allowed disabled:opacity-60">
        <FiUploadCloud size={26} aria-hidden="true" />
        <span className="font-medium">{busy ? "Uploading…" : "Upload photos"}</span>
        <span className="text-sm text-muted">{ready ? "JPG, PNG, WebP or AVIF, up to 4 MB each. They're resized and stored on Cloudinary." : "Cloudinary isn't connected yet. Add the CLOUDINARY_* values to your environment."}</span>
      </button>
      <p className="mt-3 text-sm text-muted">Replacing or removing a saved photo deletes the old one from Cloudinary when you press Save.</p>

      <div className="mt-5 flex gap-2">
        <label htmlFor="manual-image" className="sr-only">Add an image by path or link</label>
        <input id="manual-image" value={manual} onChange={(e) => setManual(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addManual(); } }}
          placeholder="Or paste /images/products/file.jpg or a Cloudinary link" className="h-11 min-w-0 flex-1 rounded border border-ink/25 bg-white px-3 text-sm focus:border-rani focus:outline-none focus:ring-2 focus:ring-rani/25" />
        <button type="button" onClick={addManual} className="h-11 rounded border border-ink/60 px-4 text-sm hover:bg-ink hover:text-paper">Add</button>
      </div>
    </div>
  );
}
