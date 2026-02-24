namespace SignalDesk.Core.Models;

public sealed class SessionState
{
    public int ActiveSlot { get; set; } = 1;
    public string ScenarioId { get; set; } = string.Empty;
    public string CurrentNodeId { get; set; } = string.Empty;
    public bool ScenarioEnded { get; set; }
    public List<TranscriptEntry> Transcript { get; set; } = new();
    public List<RollLogEntry> RollHistory { get; set; } = new();
    public string? LastEndingId { get; set; }
}

public sealed class TranscriptEntry
{
    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public string Source { get; set; } = "system";
    public string Channel { get; set; } = "inbox";
    public string Text { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
}

public sealed class RollLogEntry
{
    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public string Skill { get; set; } = string.Empty;
    public int Difficulty { get; set; }
    public int DieA { get; set; }
    public int DieB { get; set; }
    public int SkillValue { get; set; }
    public int Modifier { get; set; }
    public int Total { get; set; }
    public string Band { get; set; } = string.Empty;
    public string Context { get; set; } = string.Empty;
}
