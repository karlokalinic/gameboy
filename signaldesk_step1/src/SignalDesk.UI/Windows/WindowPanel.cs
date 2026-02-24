using Raylib_cs;

namespace SignalDesk.UI.Windows;

public abstract class WindowPanel
{
    private const float TitleBarHeight = 32f;
    private bool _isDragging;
    private Vector2 _dragOffset;

    protected WindowPanel(string id, string title, Rectangle bounds)
    {
        Id = id;
        Title = title;
        Bounds = bounds;
    }

    public string Id { get; }
    public string Title { get; protected set; }
    public bool IsVisible { get; set; } = true;
    public bool IsMinimized { get; private set; }
    public bool IsFocused { get; set; }
    public Rectangle Bounds { get; private set; }

    public Rectangle TitleBarBounds => new(Bounds.X, Bounds.Y, Bounds.Width, TitleBarHeight);
    public Rectangle MinimizeButtonBounds => new(Bounds.X + Bounds.Width - 30, Bounds.Y + 6, 18, 18);
    public Rectangle ContentBounds => new(Bounds.X + 10, Bounds.Y + TitleBarHeight + 8, Bounds.Width - 20, Bounds.Height - TitleBarHeight - 16);

    public bool HitTest(Vector2 mouse) => Raylib.CheckCollisionPointRec(mouse, Bounds);

    public bool HandleInteraction(Vector2 mouse)
    {
        if (!IsVisible)
        {
            return false;
        }

        if (Raylib.IsMouseButtonPressed(MouseButton.Left) &&
            Raylib.CheckCollisionPointRec(mouse, MinimizeButtonBounds))
        {
            ToggleMinimized();
            return true;
        }

        if (!IsMinimized && Raylib.IsMouseButtonPressed(MouseButton.Left) &&
            Raylib.CheckCollisionPointRec(mouse, TitleBarBounds))
        {
            _isDragging = true;
            _dragOffset = new Vector2(mouse.X - Bounds.X, mouse.Y - Bounds.Y);
            return true;
        }

        if (_isDragging)
        {
            if (Raylib.IsMouseButtonDown(MouseButton.Left))
            {
                Bounds = new Rectangle(mouse.X - _dragOffset.X, mouse.Y - _dragOffset.Y, Bounds.Width, Bounds.Height);
                return true;
            }

            _isDragging = false;
        }

        return false;
    }

    public void ToggleMinimized()
    {
        IsMinimized = !IsMinimized;
    }

    public virtual void Update(float dt)
    {
    }

    public void Draw()
    {
        if (!IsVisible)
        {
            return;
        }

        var borderColor = IsFocused ? new Color(118, 162, 214, 255) : new Color(78, 96, 122, 255);
        var backgroundColor = new Color(33, 42, 58, 255);
        var titleBarColor = new Color(43, 56, 76, 255);

        Raylib.DrawRectangleRec(Bounds, backgroundColor);
        Raylib.DrawRectangleRec(TitleBarBounds, titleBarColor);
        Raylib.DrawRectangleLinesEx(Bounds, 1.5f, borderColor);

        Raylib.DrawText(Title, (int)Bounds.X + 10, (int)Bounds.Y + 8, 16, Color.RayWhite);
        Raylib.DrawRectangleRec(MinimizeButtonBounds, new Color(67, 82, 104, 255));
        Raylib.DrawText("_", (int)MinimizeButtonBounds.X + 5, (int)MinimizeButtonBounds.Y - 1, 18, Color.RayWhite);

        if (IsMinimized)
        {
            return;
        }

        DrawContent(ContentBounds);
    }

    protected abstract void DrawContent(Rectangle contentBounds);
    public string Id { get; }
    public string Title { get; protected set; }
    public bool IsVisible { get; set; } = true;
    public bool IsMinimized { get; set; }
    public bool IsFocused { get; set; }

    // Step 2: replace with proper Rect/Vector structs compatible with raylib.
    public float X { get; set; }
    public float Y { get; set; }
    public float Width { get; set; } = 400;
    public float Height { get; set; } = 300;

    protected WindowPanel(string id, string title)
    {
        Id = id;
        Title = title;
    }

    public virtual void Update(float dt) { }
    public virtual void Draw() { }
}
