import React, { useRef, useEffect } from "react";
import "./FeatureCarousel.css"; // put the CSS from step 2 here

export default function FeatureCarousel({ items = [], reverse = false, speed = 20 }) {
  const trackRef = useRef(null);

  useEffect(() => {
    // set a custom CSS variable to control speed per instance
    if (trackRef.current) {
      trackRef.current.style.setProperty("--scroll-duration", `${speed}s`);
      trackRef.current.style.animationDirection = reverse ? "reverse" : "normal";
    }
  }, [reverse, speed]);

  // duplicate items to create an infinite looping track
  const rendered = [...items, ...items];

  return (
    <div className="fc-wrapper" aria-hidden={items.length === 0 ? "true" : "false"}>
      <div className="fc-track" ref={trackRef} role="list">
        {rendered.map((it, i) => (
          <div
            key={i}
            className="fc-card"
            role="listitem"
            tabIndex={0} // allow keyboard focus to pause/scale
            onFocus={(e) => e.currentTarget.classList.add("fc-paused")}
            onBlur={(e) => e.currentTarget.classList.remove("fc-paused")}
          >
            <div className="fc-icon">{it.icon}</div>
            <div className="fc-title">{it.title}</div>
            <div className="fc-desc">{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
