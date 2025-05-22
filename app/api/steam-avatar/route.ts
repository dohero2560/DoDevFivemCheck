import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const steamId = searchParams.get("id")

  if (!steamId) {
    return NextResponse.json({ error: "Steam ID is required" }, { status: 400 })
  }

  try {
    // In a real application, you would use Steam's API with a Steam Web API key
    // For example: https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={key}&steamids={steamid}

    // For this demo, we'll return a redirect to a placeholder
    return NextResponse.redirect(`/placeholder.svg?height=100&width=100&text=S${steamId.slice(-4)}`)
  } catch (error) {
    console.error("Error fetching Steam avatar:", error)
    return NextResponse.json({ error: "Failed to fetch Steam avatar" }, { status: 500 })
  }
}

