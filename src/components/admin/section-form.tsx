"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Spinner, toast } from "@heroui/react";
import type { FieldDef } from "@/lib/admin/field-defs";
import type { SectionKey } from "@/lib/content/schema";
import { saveDraftAction } from "@/app/admin/actions";
import { useAdminStore } from "@/lib/admin/store";
import { MediaField } from "./media-field";

type Json = Record<string, unknown>;

function defaultForField(field: FieldDef): unknown {
  switch (field.kind) {
    case "select":
      return field.options[0]?.value ?? "";
    case "array":
      return [];
    case "stringArray":
      return [];
    default:
      return "";
  }
}

function defaultItem(itemFields: FieldDef[]): Json {
  const item: Json = {};
  for (const f of itemFields) item[f.key] = defaultForField(f);
  return item;
}

function Field({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  if (field.kind === "text") {
    const str = typeof value === "string" ? value : "";
    return (
      <label className="flex flex-col gap-1.5">
        <span className="flex items-baseline justify-between text-sm font-medium text-onyx">
          {field.label}
          <span className="text-xs font-normal text-onyx/40">
            {str.length}/{field.maxLength}
          </span>
        </span>
        <input
          type="text"
          value={str}
          maxLength={field.maxLength}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-taupe/40 bg-bone px-3 py-2 text-sm text-onyx outline-none focus:border-onyx"
        />
      </label>
    );
  }

  if (field.kind === "textarea") {
    const str = typeof value === "string" ? value : "";
    return (
      <label className="flex flex-col gap-1.5">
        <span className="flex items-baseline justify-between text-sm font-medium text-onyx">
          {field.label}
          <span className="text-xs font-normal text-onyx/40">
            {str.length}/{field.maxLength}
          </span>
        </span>
        <textarea
          value={str}
          maxLength={field.maxLength}
          rows={field.rows ?? 3}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-taupe/40 bg-bone px-3 py-2 text-sm text-onyx outline-none focus:border-onyx"
        />
      </label>
    );
  }

  if (field.kind === "select") {
    const str = typeof value === "string" ? value : field.options[0]?.value;
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-onyx">{field.label}</span>
        <select
          value={str}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border border-taupe/40 bg-bone px-3 py-2 text-sm text-onyx outline-none focus:border-onyx"
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.kind === "media") {
    return (
      <MediaField
        label={field.label}
        value={typeof value === "string" ? value : ""}
        optional={field.optional}
        onChange={onChange}
      />
    );
  }

  if (field.kind === "stringArray") {
    const items = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-onyx">{field.label}</span>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              maxLength={field.itemMaxLength}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 rounded-lg border border-taupe/40 bg-bone px-3 py-2 text-sm text-onyx outline-none focus:border-onyx"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-crimson hover:bg-crimson/10"
            >
              ลบ
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="self-start rounded-full border border-taupe/40 px-4 py-1.5 text-xs font-semibold text-onyx hover:bg-taupe/10"
        >
          + เพิ่มรายการ
        </button>
      </div>
    );
  }

  // field.kind === "array"
  const items = Array.isArray(value) ? (value as Json[]) : [];

  function updateItem(i: number, key: string, v: unknown) {
    const next = items.map((item, idx) => (idx === i ? { ...item, [key]: v } : item));
    onChange(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-onyx">{field.label}</span>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border border-taupe/30 bg-taupe/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-onyx/50">รายการ {i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded px-2 py-1 text-xs text-onyx/60 hover:bg-taupe/20">
                ขึ้น
              </button>
              <button type="button" onClick={() => move(i, 1)} className="rounded px-2 py-1 text-xs text-onyx/60 hover:bg-taupe/20">
                ลง
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="rounded px-2 py-1 text-xs font-medium text-crimson hover:bg-crimson/10"
              >
                ลบ
              </button>
            </div>
          </div>
          {field.itemFields.map((itemField) => (
            <Field
              key={itemField.key}
              field={itemField}
              value={item[itemField.key]}
              onChange={(v) => updateItem(i, itemField.key, v)}
            />
          ))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, defaultItem(field.itemFields)])}
        className="self-start rounded-full border border-taupe/40 px-4 py-1.5 text-xs font-semibold text-onyx hover:bg-taupe/10"
      >
        + เพิ่มรายการ
      </button>
    </div>
  );
}

export function SectionForm({
  sectionKey,
  fields,
  initialValue,
}: {
  sectionKey: SectionKey;
  fields: FieldDef[];
  initialValue: Json;
}) {
  const [value, setValue] = useState<Json>(initialValue);
  const [baseline, setBaseline] = useState<Json>(initialValue);
  const [saving, setSaving] = useState(false);
  const setPending = useAdminStore((s) => s.setPending);

  const dirty = JSON.stringify(value) !== JSON.stringify(baseline);

  async function handleSave() {
    setSaving(true);
    try {
      const result = await saveDraftAction(sectionKey, value);
      if (!result.ok) {
        toast.danger(result.error);
        return;
      }
      setBaseline(value);
      setPending(sectionKey, true);
      toast.success("บันทึกฉบับร่างแล้ว");
    } catch {
      toast.danger("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={value[field.key]}
          onChange={(v) => setValue((prev) => ({ ...prev, [field.key]: v }))}
        />
      ))}

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t border-taupe/30 bg-bone/95 px-4 py-3 backdrop-blur sm:-mx-0 sm:rounded-xl sm:border sm:px-4">
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" isDisabled={saving || !dirty} onPress={handleSave} className="gap-2">
            {saving && <Spinner size="sm" color="current" />}
            {saving ? "กำลังบันทึก..." : "บันทึกฉบับร่าง"}
          </Button>
          <Link
            href="/admin/preview"
            target="_blank"
            className="rounded-full border border-taupe/40 px-6 py-2.5 text-sm font-semibold text-onyx hover:bg-taupe/10"
          >
            ดูตัวอย่าง
          </Link>
        </div>
        <p className="text-xs text-onyx/50">การบันทึกที่นี่เป็นแค่ฉบับร่าง ต้องกด "เผยแพร่ขึ้นเว็บจริง" ที่หน้าแดชบอร์ดถึงจะขึ้นเว็บจริง</p>
      </div>
    </div>
  );
}
