
const joinRoom = async (roomCode: string, playerName: string) => {
  try {
    const { data: room, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", roomCode.toUpperCase())
      .eq("is_active", true)
      .single();
      
    if (error || !room) {
      console.error("Room not found or inactive:", error);
      throw new Error("Room not found or no longer active");
    }

    const { data: userInfo, error: userError } = await supabase.auth.getUser();
    if (userError || !userInfo.user) {
      console.error("Authentication error:", userError);
      throw new Error("You must be logged in to join a room");
    }

    // Fixed: Get the exact count of players in the room
    const { data: roomPlayerList, error: countError } = await supabase
      .from("room_players")
      .select("*")
      .eq("room_id", room.id);
      
    if (countError) {
      console.error("Error checking room capacity:", countError);
      throw new Error("Could not verify room capacity");
    }
    
    const playerCount = roomPlayerList ? roomPlayerList.length : 0;
    console.log(`Room ${roomCode} has ${playerCount} players out of ${room.max_players} max`);
    
    if (playerCount >= room.max_players) {
      throw new Error(`Room is full (max ${room.max_players} players)`);
    }

    const { data: existingPlayer } = await supabase
      .from("room_players")
      .select("*")
      .eq("room_id", room.id)
      .eq("user_id", userInfo.user.id)
      .maybeSingle();

    const avatar = room.host_id === userInfo.user.id ? "👑" : "😎";

    if (!existingPlayer) {
      const { error: joinError } = await supabase.from("room_players").insert({
        room_id: room.id,
        user_id: userInfo.user.id,
        score: 0,
        avatar,
      });

      if (joinError) {
        console.error("Failed to join room:", joinError);
        throw new Error("Could not join the room");
      }
    } else {
      console.log("User already in room, updating profile");
      const { error: updateError } = await supabase
        .from("room_players")
        .update({ avatar })
        .eq("room_id", room.id)
        .eq("user_id", userInfo.user.id);
        
      if (updateError) {
        console.error("Failed to update player:", updateError);
      }
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ username: playerName, avatar })
      .eq("id", userInfo.user.id);

    if (profileError) {
      console.error("Failed to update profile:", profileError);
    }

    const { data: updatedPlayerRows, error: playersError } = await supabase
      .from("room_players")
      .select("user_id, score, avatar, user:profiles(username)")
      .eq("room_id", room.id);

    if (playersError) {
      console.error("Failed to get room players:", playersError);
      throw new Error("Could not retrieve room players");
    }

    const players = (updatedPlayerRows || []).map((row: any) => ({
      id: row.user_id,
      name: row.user?.username || "Player",
      avatar: row.avatar,
      score: row.score,
      isHost: room.host_id === row.user_id,
    }));

    toast({
      title: "Room Joined!",
      description: `You've joined room ${roomCode.toUpperCase()}`,
    });

    setGameState((prev) => ({
      ...prev,
      roomCode: roomCode.toUpperCase(),
      players,
    }));
    
    setTimeout(() => refreshPlayers(roomCode.toUpperCase()), 500);
    
  } catch (error: any) {
    console.error("Join room error:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to join room",
      variant: "destructive",
    });
    throw error;
  }
};
