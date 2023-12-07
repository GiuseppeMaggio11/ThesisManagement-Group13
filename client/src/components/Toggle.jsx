import React from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css"; // Import the styles

function ToggleComponent({ formData, handleChange }) {
  return (
    <Toggle
      id="is_archived"
      name="is_archived"
      checked={formData.is_archived === 0 ? false : true}
      onChange={handleChange}
    />
  );
}

export default ToggleComponent;
