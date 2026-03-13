"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createSupabaseClient } from "@/lib/supabase";

export default function DisabilitySelector() {

  const { user } = useUser();
  const supabase = createSupabaseClient();

  const [disability, setDisability] = useState("");

  async function saveDisability() {

    if (!disability) {
      alert("Please select disability");
      return;
    }

    await supabase.from("eduvoice_users").upsert({
      id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      disability_type: disability
    });

    alert("Disability saved");
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Select Disability</h2>

      <select onChange={(e)=>setDisability(e.target.value)}>
        <option value="">Select</option>
        <option value="blind">Blind / Low Vision</option>
        <option value="deaf">Deaf</option>
        <option value="mute">Mute</option>
        <option value="motor">Motor Disability</option>
      </select>

      <button onClick={saveDisability} style={{marginLeft:"10px"}}>
        Save
      </button>
    </div>
  );
}