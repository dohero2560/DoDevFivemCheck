"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, User, AlertCircle, Maximize2, Server, Users, Signal, Copy, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface PlayerData {
  id: string
  identifiers: string[]
  name: string
  ping: number
  endpoint?: string
}

interface ServerInfo {
  name: string
  players: PlayerData[]
}

export default function FivemChecker() {
  const [ipAddress, setIpAddress] = useState("")
  const [port, setPort] = useState("30120")
  const [playerId, setPlayerId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [playerList, setPlayerList] = useState<PlayerData[]>([])
  const [discordUsername, setDiscordUsername] = useState<string>("Loading...")
  const [discordAvatar, setDiscordAvatar] = useState<string | null>(null)
  const [steamAvatar, setSteamAvatar] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [recentIPs, setRecentIPs] = useState<Array<{ip: string, port: string, name: string}>>([])

  // Load recent IPs from localStorage on component mount
  useEffect(() => {
    const savedIPs = localStorage.getItem('recentIPs')
    if (savedIPs) {
      setRecentIPs(JSON.parse(savedIPs))
    }
  }, [])

  // Save IP to recent list
  const saveRecentIP = (ip: string, port: string, name: string) => {
    const newRecentIPs = [
      { ip, port, name },
      ...recentIPs.filter(item => item.ip !== ip).slice(0, 4)
    ]
    setRecentIPs(newRecentIPs)
    localStorage.setItem('recentIPs', JSON.stringify(newRecentIPs))
  }

  useEffect(() => {
    if (playerData) {
      // Fetch Discord user data
      const fetchDiscordData = async () => {
        const discordId = getDiscordId(playerData.identifiers)
        if (discordId === "null") return

        try {
          const response = await fetch(`/api/discord-user?id=${discordId}`)
          if (!response.ok) throw new Error('Failed to fetch Discord data')
          const data = await response.json()
          setDiscordUsername(data.username || discordId)
          // Set Discord avatar if available
          if (data.avatar) {
            setDiscordAvatar(`https://cdn.discordapp.com/avatars/${discordId}/${data.avatar}.png`)
          } else {
            // Default Discord avatar
            setDiscordAvatar(`https://cdn.discordapp.com/embed/avatars/${Number(discordId) % 5}.png`)
          }
        } catch (error) {
          console.error("Error fetching Discord data:", error)
          setDiscordUsername(discordId)
          setDiscordAvatar(null)
        }
      }

      // Fetch Steam avatar
      const fetchSteamAvatar = async () => {
        const steamId = getSteamId(playerData.identifiers)
        if (steamId === "null") return

        try {
          const response = await fetch(`/api/steam-user?id=${steamId}`)
          if (!response.ok) throw new Error('Failed to fetch Steam data')
          const data = await response.json()
          setSteamAvatar(data.avatarUrl || null)
        } catch (error) {
          console.error("Error fetching Steam avatar:", error)
          setSteamAvatar(null)
        }
      }

      fetchDiscordData()
      fetchSteamAvatar()
    }
  }, [playerData])

  const fetchServerData = async () => {
    if (!ipAddress) {
      setError("กรุณากรอก IP Address")
      return
    }

    setLoading(true)
    setError(null)
    setPlayerData(null)

    try {
      const response = await fetch(`/api/fivem-server?ip=${ipAddress}&port=${port}`)

      if (!response.ok) {
        throw new Error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")
      }

      const data = await response.json()
      setServerInfo(data)
      setPlayerList(data.players || [])

      // Save to recent IPs if successful
      saveRecentIP(ipAddress, port, data.name)

      if (playerId && data.players) {
        const player = data.players.find(
          (p: PlayerData) => p.id === playerId || p.identifiers.some((id) => id.includes(playerId)),
        )

        if (player) {
          setPlayerData(player)
        } else {
          setError("ไม่พบข้อมูลผู้เล่นที่ระบุ")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ")
    } finally {
      setLoading(false)
    }
  }

  // Function to load saved IP
  const loadSavedIP = (ip: string, port: string) => {
    setIpAddress(ip)
    setPort(port)
  }

  const getIdentifierValue = (identifiers: string[] = [], prefix: string) => {
    const identifier = identifiers.find((id) => id.startsWith(prefix))
    if (!identifier) return "ไม่พบข้อมูล"
    return identifier.replace(`${prefix}:`, "")
  }

  // Add this function to format IP address
  const formatIP = (ip: string) => {
    if (ip === "ไม่พบข้อมูล") return ip
    // Remove any port number if present
    return ip.split(":")[0]
  }

  // Function to get Discord avatar URL from Discord ID
  const getDiscordAvatar = () => {
    return discordAvatar || "/placeholder.svg?height=80&width=80&text=D"
  }

  // Function to get Steam avatar URL
  const getSteamAvatar = () => {
    return steamAvatar || "/placeholder.svg?height=80&width=80&text=S"
  }

  // Function to get Discord username from Discord ID
  const getDiscordUsername = async (identifiers: string[] = []) => {
    const discordId = getDiscordId(identifiers)
    if (discordId === "null") return "null"

    try {
      const response = await fetch(`/api/discord-user?id=${discordId}`)
      if (!response.ok) throw new Error('Failed to fetch Discord username')
      const data = await response.json()
      return data.username || discordId
    } catch (error) {
      console.error("Error fetching Discord username:", error)
      return discordId
    }
  }

  const getDiscordId = (identifiers: string[] = []) => {
    return getIdentifierValue(identifiers, "discord")
  }

  // Add function to get Discord friend request link
  const getDiscordFriendLink = (discordId: string) => {
    if (discordId === "ไม่พบข้อมูล") return null
    return `https://discord.com/users/${discordId}`
  }

  const getSteamId = (identifiers: string[] = []) => {
    const steamHex = getIdentifierValue(identifiers, "steam")
    if (steamHex === "null") return "null"
    
    try {
      // Remove 'steam:' prefix
      const cleanHex = steamHex.replace('steam:', '')
      
      // Convert hex to decimal
      const steamId = BigInt(`0x${cleanHex}`)
      
      // Convert to Steam64 ID (no need for additional conversion)
      return steamId.toString()
    } catch (error) {
      console.error("Error converting Steam Hex to Steam ID:", error)
      return "null"
    }
  }

  const getSteamHex = (identifiers: string[] = []) => {
    const steamId = getIdentifierValue(identifiers, "steam")
    return steamId
  }

  const getSteamUrl = (identifiers: string[] = []) => {
    const steamHex = getIdentifierValue(identifiers, "steam")
    if (steamHex === "null") return "null"
    
    try {
      // Remove 'steam:' prefix
      const cleanHex = steamHex.replace('steam:', '')
      
      // Convert hex to decimal
      const steamId = BigInt(`0x${cleanHex}`)
      
      // Return the Steam community URL
      return `https://steamcommunity.com/profiles/${steamId.toString()}`
    } catch (error) {
      console.error("Error generating Steam URL:", error)
      return "null"
    }
  }

  // Avatar Modal Component
  const AvatarModal = ({ src, alt }: { src: string; alt: string }) => (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button 
          className="group relative w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Image
            src={src}
            alt={alt}
            width={150}
            height={150}
            className="rounded-2xl shadow-lg mb-2 transition-all duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 rounded-2xl">
            <Maximize2 className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="sr-only">
          {`View full size ${alt}`}
        </DialogTitle>
        <div className="relative w-full aspect-square">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Add this function to filter players based on search query
  const filteredPlayers = playerList.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.id.includes(searchQuery)
  )

  const handleViewDetails = (player: PlayerData) => {
    setPlayerData(player)
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FiveM Player Identifier Checker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
         Developer By โดโด้
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Search and Server Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Section */}
            <Card className="w-full border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Server className="w-5 h-5" />
                  Server Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ip" className="text-gray-700 dark:text-gray-300">IP Address</Label>
                      <Input
                        id="ip"
                        placeholder="Enter server IP"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        className="w-full border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port" className="text-gray-700 dark:text-gray-300">Port</Label>
                      <Input
                        id="port"
                        placeholder="Enter port"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        className="w-full border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Recent IPs */}
                  {recentIPs.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Recent Servers</Label>
                      <div className="grid gap-2">
                        {recentIPs.map((item, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                            onClick={() => loadSavedIP(item.ip, item.port)}
                          >
                            <Server className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            <span className="truncate">{item.name}</span>
                            <span className="ml-2 text-muted-foreground text-sm">
                              ({item.ip}:{item.port})
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <Button
                      onClick={fetchServerData}
                      disabled={loading}
                      className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          Search
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-4 border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {serverInfo && (
              <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Signal className="w-5 h-5" />
                    Server Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Server Name</Label>
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{serverInfo.name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Players Online</Label>
                      <p className="text-lg font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        {serverInfo.players.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Player List */}
          {serverInfo && (
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-none shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Users className="w-5 h-5" />
                      Player List
                    </CardTitle>
                    <div className="relative w-48">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/80" />
                      <Input
                        placeholder="Search players..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="rounded-md border border-gray-200 dark:border-gray-700">
                    <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm z-10">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[60px] text-gray-700 dark:text-gray-300">ID</TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
                            <TableHead className="w-[80px] text-gray-700 dark:text-gray-300">Ping</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {playerList
                            .filter((player) =>
                              player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              player.id.includes(searchQuery)
                            )
                            .map((player) => (
                              <TableRow 
                                key={player.id} 
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                                onClick={() => handleViewDetails(player)}
                              >
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">{player.id}</TableCell>
                                <TableCell className="max-w-[150px] truncate text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                  {player.name}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={player.ping < 100 ? "default" : "destructive"}
                                    className={player.ping < 100 ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"}
                                  >
                                    {player.ping}ms
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer with Developer Credit */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Developer By{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                DooDevc
              </span>
            </p>
          </div>
        </div>

        {/* Player Details Modal */}
        {playerData && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto border-none shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                <User className="w-6 h-6" />
                Player Details
              </DialogTitle>

              {/* Main Content Grid */}
              <div className="grid gap-8 md:grid-cols-12">
                {/* Left Column - Avatars and Basic Info */}
                <div className="md:col-span-4 space-y-6">
                  {/* Avatars */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Discord Avatar</Label>
                        <AvatarModal src={getDiscordAvatar()} alt="Discord Avatar" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Steam Avatar</Label>
                        <AvatarModal src={getSteamAvatar()} alt="Steam Avatar" />
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Player Name</Label>
                      <p className="text-lg font-medium">{playerData.name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Player ID</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-medium">{playerData.id}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(playerData.id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ping</Label>
                      <p className="text-lg font-medium">{playerData.ping}ms</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Identifiers */}
                <div className="md:col-span-8 space-y-6">
                  {/* Main Identifiers */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Main Identifiers</h3>
                    <div className="grid gap-4">
                      <InfoRow
                        label="Discord"
                        value={getDiscordId(playerData.identifiers)}
                        icon={<i className="fab fa-discord text-[#5865F2] w-5 h-5 flex items-center justify-center"></i>}
                        canCopy
                        isLink
                        linkUrl={getDiscordFriendLink(getDiscordId(playerData.identifiers))}
                        additionalInfo={
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {discordUsername !== "Loading..." ? discordUsername : "กำลังโหลด..."}
                            </span>
                            {discordUsername !== "Loading..." && (
                              <a
                                href={getDiscordFriendLink(getDiscordId(playerData.identifiers)) || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <i className="fas fa-user-plus"></i> เพิ่มเพื่อน
                              </a>
                            )}
                          </div>
                        }
                      />
                      <InfoRow
                        label="Steam"
                        value={getSteamId(playerData.identifiers)}
                        icon={<i className="fab fa-steam text-[#00adee] w-5 h-5 flex items-center justify-center"></i>}
                        canCopy
                        isLink
                        linkUrl={getSteamUrl(playerData.identifiers)}
                        additionalInfo={
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={getSteamUrl(playerData.identifiers)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <i className="fas fa-external-link-alt"></i> ดูโปรไฟล์ Steam
                            </a>
                          </div>
                        }
                      />
                      <InfoRow
                        label="Steam Hex"
                        value={getSteamHex(playerData.identifiers)}
                        icon={<i className="fab fa-steam text-[#00adee] w-5 h-5 flex items-center justify-center"></i>}
                        canCopy
                      />
                      <InfoRow
                        label="License"
                        value={getIdentifierValue(playerData.identifiers, "license")}
                        icon={<i className="fas fa-key text-yellow-500 w-5 h-5 flex items-center justify-center"></i>}
                        canCopy
                      />
                      <InfoRow
                        label="IP"
                        value={formatIP(getIdentifierValue(playerData.identifiers, "ip"))}
                        icon={<i className="fas fa-network-wired text-blue-500 w-5 h-5 flex items-center justify-center"></i>}
                        canCopy
                      />
                    </div>
                  </div>

                  {/* All Identifiers */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">All Identifiers</h3>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                      <div className="space-y-2">
                        {playerData.identifiers.map((identifier, index) => (
                          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md">
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{identifier}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(identifier)}
                              className="p-1 h-auto hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Endpoint Information */}
                  {playerData.endpoint && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Connection Information</h3>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{playerData.endpoint}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(playerData.endpoint || '')}
                            className="p-1 h-auto hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

// Info Row Component
const InfoRow = ({ 
  label, 
  value, 
  icon, 
  canCopy = false,
  isLink = false,
  linkUrl = null,
  additionalInfo = null
}: { 
  label: string
  value: string
  icon?: React.ReactNode
  canCopy?: boolean
  isLink?: boolean
  linkUrl?: string | null
  additionalInfo?: React.ReactNode
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-4 flex flex-col hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          {icon}
          {label}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-500 dark:text-red-400">
            {value === "ไม่พบข้อมูล" ? "ไม่พบข้อมูล" : value}
          </span>
          {canCopy && value !== "ไม่พบข้อมูล" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(value)}
              className="p-1 h-auto hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
          {isLink && value !== "ไม่พบข้อมูล" && linkUrl && (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
      {additionalInfo}
    </div>
  )
}

