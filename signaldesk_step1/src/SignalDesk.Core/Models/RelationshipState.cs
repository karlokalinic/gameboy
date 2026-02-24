namespace SignalDesk.Core.Models;

public sealed class RelationshipState
{
    public float Value { get; set; }
    public float Trust { get; set; }
    public float Fear { get; set; }
    public float Respect { get; set; }
    public Dictionary<string, object?> Flags { get; set; } = new();
}
