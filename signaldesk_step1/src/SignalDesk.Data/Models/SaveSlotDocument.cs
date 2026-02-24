namespace SignalDesk.Data.Models;

public sealed class SaveSlotDocument
{
    public int Version { get; set; } = 1;
    public DateTimeOffset SavedAtUtc { get; set; } = DateTimeOffset.UtcNow;
    public string ScenarioId { get; set; } = string.Empty;
    public string CurrentNodeId { get; set; } = string.Empty;
    public Dictionary<string, object?> Data { get; set; } = new();
}
