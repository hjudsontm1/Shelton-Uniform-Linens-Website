import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shelton Linen & Uniform Services",
  description: "This Shelton domain has moved to sheltonlinen.com.",
};

export default function Home() {
  return (
    <main>
      <h1>Shelton Linen &amp; Uniform Services</h1>
      <p>This address has moved.</p>
      <a href="https://sheltonlinen.com/">Continue to sheltonlinen.com</a>
    </main>
  );
}
