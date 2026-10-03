"use client";

import { Camera, Check, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { INTEREST_OPTIONS } from "@/data/people";
import { CITIES, type City } from "@/data/shared";
import { saveMyProfile, type MyProfile } from "@/lib/social";
import { cn } from "@/lib/utils";
import { MeAvatar } from "@/components/social/Avatars";

/** Crops an uploaded photo to a square and shrinks it so it fits comfortably in browser storage. */
function resizePhoto(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      canvas.getContext("2d")!.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image"));
    };
    img.src = url;
  });
}

const toHandle = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "")
    .slice(0, 20);

export function ProfileEditor({
  initial,
  suggestedName,
  onDone,
  onCancel,
}: {
  initial: MyProfile | null;
  suggestedName?: string;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? suggestedName ?? "");
  const [handle, setHandle] = useState(initial?.handle ?? toHandle(suggestedName ?? ""));
  const [handleTouched, setHandleTouched] = useState(!!initial);
  const [city, setCity] = useState<City>(initial?.city ?? "Bellevue");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [photo, setPhoto] = useState<string | null>(initial?.photo ?? null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file?: File) {
    if (!file) return;
    try {
      setPhoto(await resizePhoto(file));
      setError(null);
    } catch {
      setError("That photo couldn't be read. Try a JPG or PNG.");
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Add your name so friends can find you.");
      return;
    }
    saveMyProfile({
      name: name.trim(),
      handle: handle || toHandle(name),
      city,
      bio: bio.trim(),
      interests,
      photo,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    });
    onDone();
  }

  const preview: MyProfile = { name: name || "You", handle, city, bio, interests, photo, createdAt: "" };

  return (
    <form onSubmit={submit} className="rounded-[1.75rem] border border-sand/80 bg-white/80 p-5 shadow-card sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-ink">{initial ? "Edit your profile" : "Create your profile"}</h2>
          <p className="mt-1 text-sm text-ink-mute">Friends see this when you RSVP, post, or message. Saved on this device.</p>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} aria-label="Close" className="grid size-9 place-items-center rounded-full text-ink-mute hover:bg-ink/5">
            <X className="size-5" />
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <MeAvatar me={preview} size={80} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-sand bg-white px-4 text-sm font-medium text-ink hover:border-maroon/30"
          >
            <Camera className="size-4" /> {photo ? "Change photo" : "Upload a photo"}
          </button>
          {photo && (
            <button type="button" onClick={() => setPhoto(null)} className="h-10 rounded-full px-3 text-sm text-ink-mute hover:text-danger">
              Remove
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">Name</span>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!handleTouched) setHandle(toHandle(e.target.value));
            }}
            placeholder="Your name"
            className="h-12 w-full rounded-xl border border-sand-deep/70 bg-white px-3.5 text-ink focus:ring-2 focus:ring-maroon/25 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">Username</span>
          <span className="flex h-12 items-center rounded-xl border border-sand-deep/70 bg-white px-3.5 focus-within:ring-2 focus-within:ring-maroon/25">
            <span className="text-ink-mute">@</span>
            <input
              value={handle}
              onChange={(e) => {
                setHandleTouched(true);
                setHandle(toHandle(e.target.value));
              }}
              className="w-full bg-transparent pl-0.5 text-ink focus:outline-none"
            />
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">City</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value as City)}
            className="h-12 w-full cursor-pointer rounded-xl border border-sand-deep/70 bg-white px-3.5 text-ink focus:ring-2 focus:ring-maroon/25 focus:outline-none"
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">About you</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 160))}
            rows={2}
            placeholder="A line about you — what you celebrate, where you're from, what you're looking for."
            className="w-full resize-none rounded-xl border border-sand-deep/70 bg-white px-3.5 py-3 text-ink focus:ring-2 focus:ring-maroon/25 focus:outline-none"
          />
          <span className="mt-1 block text-right text-xs text-ink-mute">{bio.length}/160</span>
        </label>
      </div>

      <div className="mt-2">
        <span className="mb-2 block text-sm font-medium text-ink-soft">Interests</span>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((i) => {
            const on = interests.includes(i);
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                onClick={() => setInterests((list) => (on ? list.filter((x) => x !== i) : [...list, i]))}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors",
                  on ? "border-maroon bg-maroon text-ivory" : "border-sand bg-white text-ink-soft hover:border-maroon/30",
                )}
              >
                {on && <Check className="size-3.5" />} {i}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="submit" className="h-12 rounded-full bg-maroon px-7 font-semibold text-ivory transition-colors hover:bg-maroon-deep">
          {initial ? "Save changes" : "Create profile"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="h-12 rounded-full px-5 font-medium text-ink-soft hover:bg-ink/5">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
