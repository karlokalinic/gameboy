namespace SignalDesk.UI.Windows;

public sealed class MessagesPanel : WindowPanel
{
    public List<string> TranscriptLines { get; } = new();
    public List<(string Id, string Label)> Choices { get; } = new();

    public MessagesPanel() : base("messages", "Messages") {}

    public override void Draw()
    {
        // Step 2: Raylib draw calls.
        // Render transcript + choices buttons.
    }
}
