import CompanionCard from "@/components/CompanionCard";
import CompanionsList from "@/components/CompanionsList";
import CTA from "@/components/CTA";
import {
  getAllCompanions,
  getRecentSessions,
  getBookmarkedCompanionIds
} from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

/* ---------- SAVE DISABILITY ---------- */

async function saveDisability(formData: FormData) {
  "use server";

  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const supabase = createSupabaseClient();

    const disability = String(formData.get("disability"));

    const { error } = await supabase
      .from("eduvoice_users")
      .upsert({
        id: userId,
        disability_type: disability
      });

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }

    redirect("/");

  } catch (err) {
    console.error("Save disability failed:", err);
  }
}

/* ---------- PAGE ---------- */

const Page = async () => {

  const { userId } = await auth();
  const supabase = createSupabaseClient();

  const { data } = await supabase
    .from("eduvoice_users")
    .select("disability_type")
    .eq("id", userId)
    .maybeSingle();

  const disability = data?.disability_type ?? null;

  /* ---------- FIRST TIME SCREEN ---------- */

  if (!disability) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Select Your Disability</h1>

        <form action={saveDisability}>

          <select name="disability" required>
            <option value="">Select</option>
            <option value="blind">Blind / Low Vision</option>
            <option value="deaf">Deaf</option>
            <option value="mute">Mute</option>
            <option value="motor">Motor Disability</option>
          </select>

          <button
            type="submit"
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              background: "#2563eb",
              color: "white",
              borderRadius: "6px"
            }}
          >
            Save
          </button>

        </form>
      </main>
    );
  }

  /* ---------- NORMAL DASHBOARD ---------- */

  const companions = await getAllCompanions({ limit: 3 });
  const recentSessionsCompanions = await getRecentSessions(10);
  const bookmarkedIds = await getBookmarkedCompanionIds();

  return (
    <main>

      <div
        style={{
          background: "#f3f4f6",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "6px"
        }}
      >
        Accessibility Mode: <b>{disability}</b>
      </div>

      <h1>Popular Companions</h1>

      <section className="home-section">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            {...companion}
            color={getSubjectColor(companion.subject)}
            bookmarked={bookmarkedIds.has(companion.id)}
          />
        ))}
      </section>

      <section className="home-section">
        <CompanionsList
          title="Recently completed sessions"
          companions={recentSessionsCompanions}
          classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>

    </main>
  );
};

export default Page;