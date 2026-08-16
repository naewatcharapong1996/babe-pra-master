import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import { SECTION_KEYS, sectionSchemas, type SectionContent, type SectionKey } from "./schema";

type PublishedSections = { [K in SectionKey]: SectionContent<K> };

export async function getAllPublishedSections(): Promise<PublishedSections> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("page_sections").select("key, published").in("key", SECTION_KEYS);
  if (error) throw error;

  const result = {} as PublishedSections;
  for (const row of data) {
    const key = row.key as SectionKey;
    result[key] = sectionSchemas[key].parse(row.published) as never;
  }
  return result;
}

export async function getAllDraftSections(): Promise<PublishedSections> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("page_sections").select("key, draft").in("key", SECTION_KEYS);
  if (error) throw error;

  const result = {} as PublishedSections;
  for (const row of data) {
    const key = row.key as SectionKey;
    result[key] = sectionSchemas[key].parse(row.draft) as never;
  }
  return result;
}

export type AdminSectionRow = {
  key: SectionKey;
  updated_at: string;
  published_at: string | null;
  pending: boolean;
};

export async function getSectionsForDashboard(): Promise<AdminSectionRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("page_sections")
    .select("key, draft, published, updated_at, published_at")
    .in("key", SECTION_KEYS)
    .order("key");
  if (error) throw error;

  return data.map((row) => ({
    key: row.key as SectionKey,
    updated_at: row.updated_at,
    published_at: row.published_at,
    pending: JSON.stringify(row.draft) !== JSON.stringify(row.published),
  }));
}

export async function getSectionDraft<K extends SectionKey>(key: K): Promise<SectionContent<K>> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("page_sections").select("draft").eq("key", key).single();
  if (error) throw error;
  return sectionSchemas[key].parse(data.draft) as SectionContent<K>;
}

export async function saveSectionDraft<K extends SectionKey>(key: K, content: SectionContent<K>, userId: string) {
  const validated = sectionSchemas[key].parse(content);
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("page_sections")
    .update({ draft: validated, updated_at: new Date().toISOString(), updated_by: userId })
    .eq("key", key);
  if (error) throw error;
}

export async function publishAllPending(): Promise<number> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("page_sections").select("key, draft, published").in("key", SECTION_KEYS);
  if (error) throw error;

  const pending = data.filter((row) => JSON.stringify(row.draft) !== JSON.stringify(row.published));
  if (pending.length === 0) return 0;

  const now = new Date().toISOString();
  for (const row of pending) {
    const { error: updateError } = await supabase
      .from("page_sections")
      .update({ published: row.draft, published_at: now })
      .eq("key", row.key);
    if (updateError) throw updateError;
  }
  return pending.length;
}
