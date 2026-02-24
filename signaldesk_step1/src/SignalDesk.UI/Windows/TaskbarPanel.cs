using Raylib_cs;

namespace SignalDesk.UI.Windows;

public sealed class TaskbarPanel : WindowPanel
{
    public TaskbarPanel(Rectangle bounds) : base("taskbar", "Taskbar", bounds)
    {
    }

    public IReadOnlyList<WindowPanel> DockWindows { get; set; } = Array.Empty<WindowPanel>();
    public Action<string>? OnWindowToggle { get; set; }

    protected override void DrawContent(Rectangle contentBounds)
    {
        Raylib.DrawRectangleRec(contentBounds, new Color(26, 33, 44, 255));

        var x = contentBounds.X + 6;
        foreach (var window in DockWindows)
        {
            if (window.Id == Id)
            {
                continue;
            }

            var button = new Rectangle(x, contentBounds.Y + 4, 130, 30);
            var hovered = Raylib.CheckCollisionPointRec(Raylib.GetMousePosition(), button);
            Raylib.DrawRectangleRec(button, hovered ? new Color(67, 89, 118, 255) : new Color(52, 70, 94, 255));
            Raylib.DrawText(window.Title, (int)button.X + 8, (int)button.Y + 7, 14, Color.RayWhite);

            if (hovered && Raylib.IsMouseButtonPressed(MouseButton.Left))
            {
                OnWindowToggle?.Invoke(window.Id);
            }

            x += 136;
            if (x > contentBounds.X + contentBounds.Width - 130)
            {
                break;
            }
        }
    public TaskbarPanel() : base("taskbar", "Taskbar") {}

    public override void Draw()
    {
        // Step 2: docked bottom bar showing window buttons and slot info
    }
}
