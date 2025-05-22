import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const discordId = searchParams.get("id")

  if (!discordId) {
    return NextResponse.json({ error: "Discord ID is required" }, { status: 400 })
  }

  try {
    // In a real application, you would need to use Discord's API with proper authentication
    // This would require a Discord bot token or OAuth2 credentials
    // For example: https://discord.com/api/users/{user.id}

    // For this demo, we'll return a redirect to a placeholder
    return NextResponse.redirect(`/placeholder.svg?height=100&width=100&text=D${discordId.slice(-4)}`)
  } catch (error) {
    console.error("Error fetching Discord avatar:", error)
    return NextResponse.json({ error: "Failed to fetch Discord avatar" }, { status: 500 })
  }
}

