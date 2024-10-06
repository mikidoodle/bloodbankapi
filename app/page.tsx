"use client"
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    window.location.href = '//github.com/mikidoodle/bloodbank'
  }, [])
  return (
    <main>
      <h1>🤨</h1>
    </main>
  );
}
