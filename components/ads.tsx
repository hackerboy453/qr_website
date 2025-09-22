"use client"

import { useEffect } from "react"

export default function Ads() {
  // This hook runs once when the component is added to the page.
  // Its only job is to add the ad network's script to the page.
  useEffect(() => {
    // A unique ID for the script tag to prevent adding it more than once.
    const scriptId = "adsterra-script";

    // If the script is already on the page, do nothing.
    if (document.getElementById(scriptId)) {
      return;
    }

    // Create the script element.
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = "//pl27699682.revenuecpmgate.com/2b862c55cfa5526f39d41eec496a7dc2/invoke.js";

    // Add the script to the <head> of the document to start loading it.
    document.head.appendChild(script);

  }, []); // The empty array [] ensures this effect runs only once.

  // This is the container where Adsterra will place the ad content.
  // The ad script will find this div by its 'id'.
  return (
    <div
      id="container-2b862c55cfa5526f39d41eec496a7dc2"
      style={{
        // --- Styling for the ad container ---
        position: "fixed",
        zIndex: 999, // High z-index to appear on top of other content
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)", // Centers the ad horizontally
        width: "728px",      // Standard banner width
        maxWidth: "100%",    // Ensures it's responsive on mobile
        height: "90px",      // Standard banner height
      }}
    />
  );
}
