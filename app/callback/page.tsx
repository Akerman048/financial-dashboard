"use client";

import { useEffect } from "react";

export default function CallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      console.error("No code");
      return;
    }

    console.log("CODE:", code);

    fetch(`http://localhost:3001/api/exchange?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("TOKEN:", data);

        localStorage.setItem("token", data.access_token);

        // редірект назад
        window.location.href = "/";
      })
      .catch((err) => console.error(err));
  }, []);

  return <div>Connecting your bank...</div>;
}