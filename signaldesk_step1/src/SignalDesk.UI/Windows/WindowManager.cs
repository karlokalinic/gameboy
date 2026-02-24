using Raylib_cs;

namespace SignalDesk.UI.Windows;

public sealed class WindowManager
{
    private readonly List<WindowPanel> _windows = new();

    public IReadOnlyList<WindowPanel> Windows => _windows;

    public void Add(WindowPanel panel)
    {
        _windows.Add(panel);
        BringToFront(panel.Id);
    }
    public void Add(WindowPanel panel) => _windows.Add(panel);

    public void BringToFront(string id)
    {
        var idx = _windows.FindIndex(w => w.Id == id);
        if (idx < 0)
        {
            return;
        }

        var panel = _windows[idx];
        _windows.RemoveAt(idx);
        _windows.Add(panel);

        foreach (var window in _windows)
        {
            window.IsFocused = false;
        }

        if (idx < 0) return;
        var panel = _windows[idx];
        _windows.RemoveAt(idx);
        _windows.Add(panel);
        foreach (var w in _windows) w.IsFocused = false;
        panel.IsFocused = true;
    }

    public void ToggleMinimize(string id)
    {
        var panel = _windows.FirstOrDefault(w => w.Id == id);
        panel?.ToggleMinimized();
        if (panel is null) return;
        panel.IsMinimized = !panel.IsMinimized;
    }

    public void Update(float dt)
    {
        var mouse = Raylib.GetMousePosition();

        if (Raylib.IsMouseButtonPressed(MouseButton.Left))
        {
            for (var i = _windows.Count - 1; i >= 0; i--)
            {
                var window = _windows[i];
                if (window.HitTest(mouse))
                {
                    BringToFront(window.Id);
                    break;
                }
            }
        }

        foreach (var window in _windows)
        {
            window.Update(dt);
            window.HandleInteraction(mouse);
        }
        foreach (var window in _windows.Where(w => w.IsVisible && !w.IsMinimized))
            window.Update(dt);
    }

    public void Draw()
    {
        foreach (var window in _windows)
        {
            window.Draw();
        }
        foreach (var window in _windows.Where(w => w.IsVisible && !w.IsMinimized))
            window.Draw();
    }
}
