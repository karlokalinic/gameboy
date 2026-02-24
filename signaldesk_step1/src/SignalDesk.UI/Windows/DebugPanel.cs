using Raylib_cs;

namespace SignalDesk.UI.Windows;

public sealed class DebugPanel : WindowPanel
{
    public DebugPanel(Rectangle bounds) : base("debug", "Debug", bounds)
    {
    }

    public string ScenarioId { get; set; } = "<none>";
    public string NodeId { get; set; } = "<none>";
    public string ScenarioPath { get; set; } = "<none>";
    public string LastMessage { get; set; } = "Ready";

    protected override void DrawContent(Rectangle contentBounds)
    {
        Raylib.DrawRectangleRec(contentBounds, new Color(26, 33, 44, 255));
        Raylib.DrawText($"Scenario: {ScenarioId}", (int)contentBounds.X + 8, (int)contentBounds.Y + 8, 16, Color.LightGray);
        Raylib.DrawText($"Node: {NodeId}", (int)contentBounds.X + 8, (int)contentBounds.Y + 30, 16, Color.LightGray);
        Raylib.DrawText("Path:", (int)contentBounds.X + 8, (int)contentBounds.Y + 52, 16, Color.LightGray);
        Raylib.DrawText(ScenarioPath, (int)contentBounds.X + 8, (int)contentBounds.Y + 74, 16, Color.Gray);
        Raylib.DrawText($"Log: {LastMessage}", (int)contentBounds.X + 8, (int)contentBounds.Y + 96, 16, Color.LightGray);
    }
}
