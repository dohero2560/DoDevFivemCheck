import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const steamId = searchParams.get("id")

  if (!steamId) {
    return NextResponse.json({ error: "Steam ID is required" }, { status: 400 })
  }

  try {
    // Steam Web API endpoint
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Steam user')
    }

    const data = await response.json()
    const player = data.response.players[0]

    if (!player) {
      throw new Error('Steam user not found')
    }

    return NextResponse.json({
      avatarUrl: player.avatarfull || player.avatarmedium || player.avatar,
      personaname: player.personaname,
      profileurl: player.profileurl,
    })
  } catch (error) {
    console.error("Error fetching Steam user:", error)
    return NextResponse.json({ error: "Failed to fetch Steam user" }, { status: 500 })
  }
} 