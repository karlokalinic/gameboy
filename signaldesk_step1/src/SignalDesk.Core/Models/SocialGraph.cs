namespace SignalDesk.Core.Models;

public sealed class SocialGraph
{
    public List<SocialLink> Links { get; set; } = new();
}

public sealed class SocialLink
{
    public string FromId { get; set; } = string.Empty;
    public string ToId { get; set; } = string.Empty;
    public RelationType RelationType { get; set; } = RelationType.Coworker;
    public float Weight { get; set; } = 1f;
}

public enum RelationType
{
    Ally,
    Friend,
    Coworker,
    Rival,
    Enemy,
    Fear,
    Debt,
    Protector
}
