namespace SignalDesk.UI.Windows;

public abstract class WindowPanel
{
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
