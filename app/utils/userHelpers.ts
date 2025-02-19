// Generates a consistent background color based on the user's name
export const generateColor = (name: string): string => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  const index = name
    ? name.charCodeAt(0) % colors.length // Generate consistent color per user
    : 0;
  return colors[index];
};

// Extracts the first letter of the first and last name
export const getInitials = (name: string): string => {
  if (!name) return "??";
  const nameParts = name
    .trim()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
  return nameParts.length > 1
    ? nameParts[0][0] + nameParts[1][0] // First letter of First and Last name
    : nameParts[0][0];
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat().format(number);
};
