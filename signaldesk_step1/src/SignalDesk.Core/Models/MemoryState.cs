namespace SignalDesk.Core.Models;

public sealed class MemoryState
{
    public Dictionary<string, object?> CaseFlags { get; set; } = new();
    public Dictionary<string, object?> EmotionalFlags { get; set; } = new();
    public Dictionary<string, object?> SocialMemory { get; set; } = new();
}
