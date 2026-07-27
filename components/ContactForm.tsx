"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // ボット対策: 人間には見えない欄に値が入っていたら無視

    setStatus("submitting");
    const { error } = await supabase.from("feedback_submissions").insert({
      message,
      contact_email: contactEmail || null,
    });

    if (error) {
      console.error("[ContactForm] Supabase error:", error.message);
      setStatus("error");
      return;
    }
    setStatus("done");
    setMessage("");
    setContactEmail("");
  };

  if (status === "done") {
    return (
      <div className="rounded-card border border-line bg-surface p-6 text-center">
        <p className="font-display text-lg font-bold text-ink">送信しました</p>
        <p className="mt-2 text-sm text-muted">教えていただきありがとうございます。確認して対応します。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line bg-surface p-6">
      <label className="flex flex-col gap-1.5 text-sm text-muted">
        内容<span className="text-trail">*</span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="例: 〇〇小屋の水場情報が実際と違っていました"
          className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="mt-4 flex flex-col gap-1.5 text-sm text-muted">
        返信が必要な場合はメールアドレス(任意)
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="例: example@example.com"
          className="focus-ring rounded-md border border-line bg-mist px-3 py-2 text-sm text-ink"
        />
      </label>

      {/* ボット対策のハニーポット欄: 人間には見えない */}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {status === "error" && (
        <p className="mt-3 text-sm text-trail">送信に失敗しました。時間をおいて再度お試しください。</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring mt-4 inline-flex items-center justify-center rounded-sm bg-pine px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:bg-pine-dark disabled:opacity-60"
      >
        {status === "submitting" ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
