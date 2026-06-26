import { useNavigate } from "react-router-dom";

export default function PageLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  return (
    // Changed: Added background color and removed large padding that caused the "border"
    <div style={{ 
      backgroundColor: "#05070a", 
      minHeight: "100vh",
      width: "100%",
      margin: 0,
      padding: 0 // Padding is now handled inside the children components
    }}>
      {/* REMOVED: The button and headers were moved/deleted 
          to keep the layout clean as requested.
      */}

      {children}
    </div>
  );
}