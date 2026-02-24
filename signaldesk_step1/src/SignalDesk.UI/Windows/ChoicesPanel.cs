using Raylib_cs;

namespace SignalDesk.UI.Windows;

public sealed class ChoicesPanel : WindowPanel
{
    public ChoicesPanel(Rectangle bounds) : base("choices", "Choices", bounds)
    {
    }

    public IReadOnlyList<ChoiceItem> Choices { get; set; } = Array.Empty<ChoiceItem>();
    public Action<string>? OnChoiceSelected { get; set; }

    protected override void DrawContent(Rectangle contentBounds)
    {
        Raylib.DrawRectangleRec(contentBounds, new Color(26, 33, 44, 255));

        var y = contentBounds.Y + 8;
        for (var i = 0; i < Choices.Count; i++)
        {
            var choice = Choices[i];
            var button = new Rectangle(contentBounds.X + 6, y, contentBounds.Width - 12, 40);
            var mouse = Raylib.GetMousePosition();
            var hovered = Raylib.CheckCollisionPointRec(mouse, button);
            var color = hovered ? new Color(67, 89, 118, 255) : new Color(52, 70, 94, 255);
            Raylib.DrawRectangleRec(button, color);
            Raylib.DrawRectangleLinesEx(button, 1f, new Color(105, 129, 156, 255));
            Raylib.DrawText(choice.Label, (int)button.X + 8, (int)button.Y + 11, 16, Color.RayWhite);

            if (hovered && Raylib.IsMouseButtonPressed(MouseButton.Left))
            {
                OnChoiceSelected?.Invoke(choice.Id);
            }

            y += 48;
            if (y + 40 > contentBounds.Y + contentBounds.Height)
            {
                break;
            }
        }
    }
}

public sealed record ChoiceItem(string Id, string Label);
