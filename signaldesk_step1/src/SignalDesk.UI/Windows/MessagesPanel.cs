using Raylib_cs;

namespace SignalDesk.UI.Windows;

public sealed class MessagesPanel : WindowPanel
{
    public MessagesPanel(Rectangle bounds) : base("messages", "Messages", bounds)
    {
    }

    public IReadOnlyList<string> TranscriptLines { get; set; } = Array.Empty<string>();

    protected override void DrawContent(Rectangle contentBounds)
    {
        Raylib.DrawRectangleRec(contentBounds, new Color(26, 33, 44, 255));

        var maxLines = (int)(contentBounds.Height / 22f);
        var start = Math.Max(0, TranscriptLines.Count - maxLines);
        var y = (int)contentBounds.Y + 8;
        for (var i = start; i < TranscriptLines.Count; i++)
        {
            Raylib.DrawText(TranscriptLines[i], (int)contentBounds.X + 8, y, 18, Color.LightGray);
            y += 22;
        }
    }
}
