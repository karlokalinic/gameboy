namespace SignalDesk.Core.Models;

public sealed class ThoughtCabinetState
{
    public int Capacity { get; set; } = 3;
    public string? ActiveResearchThoughtId { get; set; }
    public int ResearchProgress { get; set; }
    public List<ThoughtEntryState> Thoughts { get; set; } = new();
}

public sealed class ThoughtEntryState
{
    public string Id { get; set; } = string.Empty;
    public string State { get; set; } = "discovered"; // discovered/researching/internalized
    public int? SlotIndex { get; set; }
}
