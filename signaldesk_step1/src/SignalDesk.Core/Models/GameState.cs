namespace SignalDesk.Core.Models;

public sealed class GameState
{
    public PlayerState Player { get; set; } = new();
    public SessionState Session { get; set; } = new();
    public WorldState World { get; set; } = new();
    public Dictionary<string, RelationshipState> Relationships { get; set; } = new();
    public MemoryState Memory { get; set; } = new();
    public ThoughtCabinetState ThoughtCabinet { get; set; } = new();
}
