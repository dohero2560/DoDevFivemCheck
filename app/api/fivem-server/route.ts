import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ip = searchParams.get("ip")
  const port = searchParams.get("port") || "30120"

  if (!ip) {
    return NextResponse.json({ error: "IP address is required" }, { status: 400 })
  }

  try {
    // Fetch server info
    const infoResponse = await fetch(`http://${ip}:${port}/info.json`)
    if (!infoResponse.ok) {
      return NextResponse.json({ error: "Failed to connect to server" }, { status: 502 })
    }
    const serverInfo = await infoResponse.json()

    // Fetch players list
    const playersResponse = await fetch(`http://${ip}:${port}/players.json`)
    if (!playersResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch players data" }, { status: 502 })
    }
    const players = await playersResponse.json()

    return NextResponse.json({
      name: serverInfo.vars?.sv_projectName || serverInfo.vars?.sv_hostname || "Unknown Server",
      players: players.map((player: any) => ({
        id: player.id.toString(),
        identifiers: player.identifiers || [],
        name: player.name || "Unknown",
        ping: player.ping || 0,
        endpoint: player.endpoint,
      })),
    })
  } catch (error) {
    console.error("Error fetching FiveM server data:", error)
    return NextResponse.json({ error: "Failed to connect to FiveM server" }, { status: 500 })
  }
}

