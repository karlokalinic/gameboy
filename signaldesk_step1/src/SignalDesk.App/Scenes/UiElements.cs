using Raylib_cs;

namespace SignalDesk.App.Scenes;

internal static class UiElements
{
    public static bool Button(Rectangle bounds, string label)
    {
        var mouse = Raylib.GetMousePosition();
        var hovered = Raylib.CheckCollisionPointRec(mouse, bounds);

        Raylib.DrawRectangleRec(bounds, hovered ? new Color(72, 92, 124, 255) : new Color(48, 66, 96, 255));
        Raylib.DrawRectangleLinesEx(bounds, 1.5f, new Color(130, 150, 180, 255));

        var fontSize = 24;
        var textWidth = Raylib.MeasureText(label, fontSize);
        var textX = bounds.X + (bounds.Width - textWidth) * 0.5f;
        var textY = bounds.Y + (bounds.Height - fontSize) * 0.5f;
        Raylib.DrawText(label, (int)textX, (int)textY, fontSize, Color.RayWhite);

        return hovered && Raylib.IsMouseButtonPressed(MouseButton.Left);
    }
}
