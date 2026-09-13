/**
 * The small DOM chores every interactive page repeats.
 *
 * Kept here so a page's script is about what it does, not about toggling
 * hidden attributes — and so "what a busy button looks like" or "how an error
 * is announced" is decided once rather than eight slightly different ways.
 */

export const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);

export const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

type NoteKind = 'error' | 'success' | 'info';

/**
 * Say something back to the person.
 *
 * The element carries role="status" in the markup, so assistive tech announces
 * the change. Passing null hides it again.
 */
export function note(el: HTMLElement | null, message: string | null, kind: NoteKind = 'error') {
  if (!el) return;
  if (!message) {
    el.hidden = true;
    el.textContent = '';
    return;
  }
  // Swap only the kind modifier. Assigning className wholesale dropped every
  // other class the page had put on the element — which is how #page-note lost
  // the margin separating it from the section below the instant it was first
  // shown, and would silently do the same to any layout class added later.
  el.classList.remove('note-error', 'note-success', 'note-info');
  el.classList.add('note', `note-${kind}`);
  el.textContent = message;
  el.hidden = false;
}

/**
 * Put a button in its working state and give the label back afterwards.
 *
 * Returns a function that restores it, so a caller can `const done = busy(btn);
 * try { … } finally { done() }` and never leave a button stuck.
 */
export function busy(btn: HTMLButtonElement | null, label = 'Working…') {
  if (!btn) return () => {};
  const original = btn.innerHTML;
  btn.setAttribute('aria-busy', 'true');
  btn.disabled = true;
  btn.textContent = label;
  return () => {
    btn.removeAttribute('aria-busy');
    btn.disabled = false;
    btn.innerHTML = original;
  };
}

/** Copy text and confirm it on the button that was pressed. */
export async function copyToClipboard(text: string, btn?: HTMLButtonElement | null) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard access is refused in some embedded browsers. Selecting the
    // text is a worse experience than copying, but better than nothing
    // happening at all.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } finally { ta.remove(); }
  }
  if (btn) {
    const original = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = original; }, 1600);
  }
}

/** Escape user-supplied text before it goes anywhere near innerHTML. */
export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

/** "3 days" / "in 2 hours" — enough precision for an invite expiry. */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const ms = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(ms);
  const day = 86_400_000;
  const hour = 3_600_000;
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  if (abs >= day) return rtf.format(Math.round(ms / day), 'day');
  if (abs >= hour) return rtf.format(Math.round(ms / hour), 'hour');
  return rtf.format(Math.round(ms / 60_000), 'minute');
}
