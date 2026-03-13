"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";

export default function SelectDisability() {

  const { user } = useUser();
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [disability, setDisability] = useState("");

  async function saveDisability() {

    if (!disability) {
      alert("Please select disability");
      return;
    }

    const { error } = await supabase
      .from("eduvoice_users")
      .insert({
        id: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
        disability_type: disability
      });

    if (error) {
      console.error("Insert error:", error.message);
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">

      <h1 className="text-2xl font-bold">
        Select Your Disability
      </h1>

      <select
        className="border p-2 rounded"
        onChange={(e) => setDisability(e.target.value)}
      >
        <option value="">Select Disability</option>
        <option value="blind">Blind / Low Vision</option>
        <option value="deaf">Deaf</option>
        <option value="mute">Mute</option>
        <option value="motor">Motor Disability</option>
      </select>

      <button
        onClick={saveDisability}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Continue
      </button>

    </div>
  );
}