import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const discordId = searchParams.get("id")

  if (!discordId) {
    return NextResponse.json({ error: "Discord ID is required" }, { status: 400 })
  }

  try {
    // Discord API endpoint
    const response = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Discord user')
    }

    const data = await response.json()
    return NextResponse.json({
      username: data.username,
      discriminator: data.discriminator,
      avatar: data.avatar,
    })
  } catch (error) {
    console.error("Error fetching Discord user:", error)
    return NextResponse.json({ error: "Failed to fetch Discord user" }, { status: 500 })
  }
} 