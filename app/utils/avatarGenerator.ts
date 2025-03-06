import { generateColor, getInitials } from "./userHelpers";

export function generateProfileSVG(name: string) {
  const initials = getInitials(name); // Extract initials
  const bgColor = generateColor(name); // Generate color based on the name

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <circle cx="50" cy="50" r="50" fill="${bgColor}" />
      <text x="50%" y="50%" font-size="35" text-anchor="middle" dy=".35em" fill="white" font-family="Arial, sans-serif">
        ${initials}
      </text>
    </svg>
  `;
}
