namespace SignalDesk.Core.Models;

public sealed class WorldState
{
    public string CurrentDistrictId { get; set; } = "dock_delta";
    public DateTimeOffset Time { get; set; } = DateTimeOffset.UtcNow;
    public Dictionary<string, DistrictState> Districts { get; set; } = new();
    public Dictionary<string, object?> GlobalFlags { get; set; } = new();
}

public sealed class DistrictState
{
    public float Heat { get; set; }
    public float Surveillance { get; set; }
    public float Unrest { get; set; }
    public bool Unlocked { get; set; }
}
