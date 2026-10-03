"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarHeart, CreditCard, Heart, MapPin, Package, Pencil, Settings, Trash2, UserPlus, UsersRound } from "lucide-react";
import { useState } from "react";
import { closet } from "@/data/closet";
import { events } from "@/data/events";
import { people } from "@/data/people";
import { vendors } from "@/data/vendors";
import { clearOrders, forgetProfile, useOrders, useSavedProfile } from "@/lib/orders";
import { connectionStatus, resetSocial, useSocial } from "@/lib/social";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { EventCard } from "@/components/cards/EventCard";
import { OutfitCard } from "@/components/cards/OutfitCard";
import { VendorCard } from "@/components/cards/VendorCard";
import { EventRow } from "@/components/events/EventRow";
import { MeAvatar, PersonAvatar } from "@/components/social/Avatars";
import { MessageButton } from "@/components/social/PeopleActions";
import { GoingPill } from "@/components/social/Rsvp";
import { OrderTrackingCard } from "./OrderTracking";
import { ProfileEditor } from "./ProfileEditor";

type Tab = "orders" | "events" | "saved" | "connections" | "settings";
const TABS: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "events", label: "My events", icon: CalendarHeart },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "connections", label: "Connections", icon: UsersRound },
  { id: "settings", label: "Settings", icon: Settings },
];

export function ProfileView() {
  const sp = useSearchParams();
  const router = useRouter();
  const s = useSocial();
  const orders = useOrders();
  const saved = useSavedProfile();
  const [editing, setEditing] = useState(false);
  const tab = (TABS.find((t) => t.id === sp.get("tab"))?.id ?? "orders") as Tab;

  const friends = people.filter((p) => connectionStatus(s, p) === "connected");
  const goingCount = Object.values(s.rsvps).filter((r) => r === "going").length;

  function go(next: Tab) {
    router.replace(next === "orders" ? "/profile" : `/profile?tab=${next}`, { scroll: false });
  }

  return (
    <section className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      {editing ? (
        <ProfileEditor initial={s.me} suggestedName={saved?.name} onDone={() => setEditing(false)} onCancel={() => setEditing(false)} />
      ) : s.me ? (
        <div className="relative overflow-hidden rounded-[2rem] bg-maroon-ink text-ivory">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgb(232_177_91/0.35),transparent_55%)]" />
          <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="rounded-full ring-4 ring-ivory/20">
              <MeAvatar me={s.me} size={96} />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-4xl">{s.me.name}</h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-ivory/70">
                <span>@{s.me.handle}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" /> {s.me.city}
                </span>
              </p>
              {s.me.bio && <p className="mt-2 max-w-xl text-ivory/85">{s.me.bio}</p>}
              {s.me.interests.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.me.interests.map((i) => (
                    <span key={i} className="rounded-full bg-ivory/10 px-2.5 py-1 text-xs text-ivory/85 ring-1 ring-ivory/15">
                      {i}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-10 items-center gap-2 self-start rounded-full bg-ivory/10 px-4 text-sm font-medium ring-1 ring-ivory/20 hover:bg-ivory/15"
            >
              <Pencil className="size-4" /> Edit profile
            </button>
          </div>
          <dl className="relative grid grid-cols-3 border-t border-ivory/10">
            {[
              ["Going", goingCount],
              ["Connections", friends.length],
              ["Orders", orders.length],
            ].map(([label, n]) => (
              <div key={label as string} className="px-6 py-4 sm:px-8">
                <dt className="text-xs tracking-wider text-ivory/60 uppercase">{label}</dt>
                <dd className="font-display text-2xl">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-[2rem] bg-maroon-ink p-6 text-ivory sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <MeAvatar me={null} size={64} className="bg-ivory/15" />
            <div>
              <h1 className="font-display text-3xl">Your profile</h1>
              <p className="mt-1 text-ivory/75">Create a profile so friends can see you&apos;re going and message you.</p>
            </div>
          </div>
          <button type="button" onClick={() => setEditing(true)} className="h-11 rounded-full bg-saffron px-6 font-semibold text-maroon-ink hover:bg-gold">
            Create profile
          </button>
        </div>
      )}

      <nav className="no-scrollbar sticky top-16 z-30 -mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-sand/70 bg-ivory/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-20 lg:mx-0 lg:px-0" aria-label="Profile sections">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            aria-current={tab === id ? "page" : undefined}
            className={cn("relative inline-flex h-12 shrink-0 items-center gap-2 px-4 text-sm font-medium transition-colors", tab === id ? "text-maroon" : "text-ink-soft hover:text-ink")}
          >
            <Icon className="size-4" /> {label}
            {tab === id && <motion.span layoutId="profile-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-maroon" />}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "orders" && <OrdersTab />}
        {tab === "events" && <EventsTab />}
        {tab === "saved" && <SavedTab />}
        {tab === "connections" && <ConnectionsTab />}
        {tab === "settings" && <SettingsTab onEdit={() => setEditing(true)} />}
      </div>
    </section>
  );
}

function OrdersTab() {
  const orders = useOrders();
  const now = useNow(4000);
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package className="size-7" strokeWidth={1.6} />}
        title="No orders yet"
        description="Tickets, rentals, purchases, and vendor bookings show up here with live tracking."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/closet">Shop the closet</ButtonLink>
            <ButtonLink href="/events" variant="outline">
              Find events
            </ButtonLink>
          </div>
        }
      />
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o, i) => (
        <OrderTrackingCard key={o.number} order={o} now={now} defaultOpen={i === 0} />
      ))}
      <p className="pt-2 text-center text-xs text-ink-mute">Demo: delivery tracking updates are sped up so you can watch an order arrive.</p>
    </div>
  );
}

function EventsTab() {
  const s = useSocial();
  const orders = useOrders();
  const ticketSlugs = new Set(orders.filter((o) => o.kind === "event").map((o) => o.slug));
  const going = events.filter((e) => s.rsvps[e.slug] === "going" || ticketSlugs.has(e.slug)).sort((a, b) => a.date.localeCompare(b.date));
  const interested = events.filter((e) => s.rsvps[e.slug] === "interested" && !ticketSlugs.has(e.slug));

  if (going.length === 0 && interested.length === 0) {
    return (
      <EmptyState
        icon={<CalendarHeart className="size-7" strokeWidth={1.6} />}
        title="You haven't RSVP'd to anything yet"
        description="Tap “Going?” on any event — it'll show up here and on your calendar."
        action={<ButtonLink href="/events">Find events</ButtonLink>}
      />
    );
  }
  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Link href="/calendar" className="text-sm font-medium text-maroon hover:underline">
          View on calendar
        </Link>
      </div>
      {[
        ["Going", going],
        ["Interested", interested],
      ].map(
        ([label, list]) =>
          (list as typeof events).length > 0 && (
            <div key={label as string}>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-gold-deep uppercase">{label as string}</h2>
              <div className="mt-4 space-y-3">
                {(list as typeof events).map((e) => (
                  <div key={e.slug} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <EventRow event={e} compact />
                    </div>
                    {ticketSlugs.has(e.slug) ? (
                      <span className="shrink-0 rounded-full bg-leaf-soft px-3 py-1.5 text-xs font-semibold text-leaf">Tickets</span>
                    ) : (
                      <GoingPill event={e} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}

function SavedTab() {
  const s = useSocial();
  const savedEvents = events.filter((e) => s.saved.event.includes(e.slug));
  const savedOutfits = closet.filter((o) => s.saved.outfit.includes(o.slug));
  const savedVendors = vendors.filter((v) => s.saved.vendor.includes(v.slug));
  if (!savedEvents.length && !savedOutfits.length && !savedVendors.length) {
    return (
      <EmptyState
        icon={<Heart className="size-7" strokeWidth={1.6} />}
        title="Nothing saved yet"
        description="Tap the heart on any event, outfit, or vendor to keep it here."
        action={<ButtonLink href="/closet">Browse the closet</ButtonLink>}
      />
    );
  }
  return (
    <div className="space-y-12">
      {savedOutfits.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold-deep uppercase">Outfits</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3">
            {savedOutfits.map((o) => (
              <OutfitCard key={o.slug} outfit={o} />
            ))}
          </div>
        </div>
      )}
      {savedEvents.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold-deep uppercase">Events</h2>
          <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2">
            {savedEvents.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </div>
      )}
      {savedVendors.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gold-deep uppercase">Vendors</h2>
          <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2">
            {savedVendors.map((v) => (
              <VendorCard key={v.slug} vendor={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ConnectionsTab() {
  const s = useSocial();
  const friends = people.filter((p) => connectionStatus(s, p) === "connected");
  const pending = people.filter((p) => connectionStatus(s, p) === "pending");
  return (
    <div className="space-y-8">
      {pending.length > 0 && (
        <p className="rounded-2xl bg-saffron-soft px-4 py-3 text-sm text-gold-deep">
          {pending.length} connection {pending.length === 1 ? "request" : "requests"} waiting for a reply.
        </p>
      )}
      <ul className="divide-y divide-sand/70 overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/60">
        {friends.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-4">
            <Link href={`/people/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
              <PersonAvatar person={p} size={48} />
              <span className="min-w-0">
                <span className="block truncate font-semibold text-ink hover:text-maroon">{p.name}</span>
                <span className="block truncate text-sm text-ink-mute">
                  {p.city} · going to {p.going.length} events
                </span>
              </span>
            </Link>
            <MessageButton person={p} size="sm" />
          </li>
        ))}
      </ul>
      <ButtonLink href="/community?tab=people" variant="outline">
        <UserPlus className="size-4" /> Find more people
      </ButtonLink>
    </div>
  );
}

function SettingsTab({ onEdit }: { onEdit: () => void }) {
  const saved = useSavedProfile();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-sand/80 bg-white/60 p-5">
        <div>
          <p className="font-semibold text-ink">Profile</p>
          <p className="text-sm text-ink-mute">Name, photo, city, bio, and interests.</p>
        </div>
        <button type="button" onClick={onEdit} className="inline-flex h-10 items-center gap-2 rounded-full border border-sand bg-white px-4 text-sm font-medium hover:border-maroon/30">
          <Pencil className="size-4" /> Edit profile
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-sand/80 bg-white/60 p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-ink text-ivory">
            <CreditCard className="size-4" />
          </span>
          <div>
            <p className="font-semibold text-ink">Saved checkout details</p>
            <p className="text-sm text-ink-mute">
              {saved ? `${saved.email}${saved.card ? ` · ${saved.card.brand} ending ${saved.card.last4}` : ""}` : "Nothing saved yet — tick “Save my details” at checkout."}
            </p>
          </div>
        </div>
        {saved && (
          <button type="button" onClick={forgetProfile} className="h-10 rounded-full px-4 text-sm font-medium text-ink-soft hover:bg-ink/5">
            Forget
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-danger/20 bg-danger/5 p-5">
        <div>
          <p className="font-semibold text-ink">Reset the demo</p>
          <p className="text-sm text-ink-mute">Clears orders, RSVPs, messages, connections, and your profile on this device.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Clear all demo data on this device?")) {
              clearOrders();
              forgetProfile();
              resetSocial();
            }
          }}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-danger ring-1 ring-danger/30 hover:bg-danger/10"
        >
          <Trash2 className="size-4" /> Clear demo data
        </button>
      </div>
    </div>
  );
}
