export default function getAuthErrorMessage(message) {
  const normalizedMessage = message.toLowerCase()

  if (
    normalizedMessage.includes("already registered") ||
    normalizedMessage.includes("already exists") ||
    normalizedMessage.includes("user already")
  ) {
    return "This email already exists. Please sign in instead."
  }

  return message
}