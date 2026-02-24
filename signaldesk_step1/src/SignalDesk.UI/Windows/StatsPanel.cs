using Raylib_cs;

namespace SignalDesk.UI.Windows;

public sealed class StatsPanel : WindowPanel
{
    public StatsPanel(Rectangle bounds) : base("stats", "Stats", bounds)
    {
    }

    public string Archetype { get; set; } = "unknown";
    public string SignatureSkill { get; set; } = "logic";
    public int KnownSkills { get; set; }

    protected override void DrawContent(Rectangle contentBounds)
    {
        Raylib.DrawRectangleRec(contentBounds, new Color(26, 33, 44, 255));
        Raylib.DrawText($"Archetype: {Archetype}", (int)contentBounds.X + 8, (int)contentBounds.Y + 8, 18, Color.LightGray);
        Raylib.DrawText($"Signature: {SignatureSkill}", (int)contentBounds.X + 8, (int)contentBounds.Y + 34, 18, Color.LightGray);
        Raylib.DrawText($"Skills tracked: {KnownSkills}", (int)contentBounds.X + 8, (int)contentBounds.Y + 60, 18, Color.LightGray);
    }
}
