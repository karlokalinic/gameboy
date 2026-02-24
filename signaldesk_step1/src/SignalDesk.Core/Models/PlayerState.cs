namespace SignalDesk.Core.Models;

public sealed class PlayerState
{
    public string Name { get; set; } = "Operator";
    public string Archetype { get; set; } = "cold_analyst";
    public string SignatureSkill { get; set; } = "logic";
    public Dictionary<string, int> Skills { get; set; } = new();
    public Dictionary<string, float> Stats { get; set; } = new();
    public List<string> Inventory { get; set; } = new();
    public Dictionary<string, object?> Flags { get; set; } = new();
}
