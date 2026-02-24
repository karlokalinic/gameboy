using Raylib_cs;
using SignalDesk.App.Scenes;

namespace SignalDesk.App.Infrastructure;

public sealed class GameHost
{
    public const int WindowWidth = 1600;
    public const int WindowHeight = 900;

    public SceneManager SceneManager { get; } = new();

    public string RootPath { get; private set; } = string.Empty;
    public string AssetsPath { get; private set; } = string.Empty;
    public string DataPath { get; private set; } = string.Empty;
    public string SavesPath { get; private set; } = string.Empty;
    public string LogsPath { get; private set; } = string.Empty;

    public void Initialize()
    {
        RootPath = ResolveRootPath();
        AssetsPath = Path.Combine(RootPath, "assets");
        DataPath = Path.Combine(RootPath, "data");
        SavesPath = Path.Combine(RootPath, "saves");
        LogsPath = Path.Combine(RootPath, "logs");

        Directory.CreateDirectory(AssetsPath);
        Directory.CreateDirectory(DataPath);
        Directory.CreateDirectory(SavesPath);
        Directory.CreateDirectory(LogsPath);

        Raylib.SetConfigFlags(ConfigFlags.ResizableWindow | ConfigFlags.VSyncHint);
        Raylib.InitWindow(WindowWidth, WindowHeight, "SignalDesk - Step 2 Runtime Bootstrap");
        Raylib.SetTargetFPS(60);

        SceneManager.Replace(new BootScene(this));
    }

    public void Run()
    {
        while (!Raylib.WindowShouldClose())
        {
            var dt = Raylib.GetFrameTime();
            SceneManager.Update(dt);

            Raylib.BeginDrawing();
            Raylib.ClearBackground(new Color(18, 20, 27, 255));
            SceneManager.Draw();
            DrawGlobalOverlay();
            Raylib.EndDrawing();
        }

        SceneManager.Clear();
        Raylib.CloseWindow();
    }

    private static string ResolveRootPath()
    {
        var cwd = Directory.GetCurrentDirectory();
        var candidate = Path.GetFullPath(Path.Combine(cwd, "..", "..", "..", ".."));

        if (Directory.Exists(Path.Combine(candidate, "docs")) &&
            Directory.Exists(Path.Combine(candidate, "src")))
        {
            return candidate;
        }

        return cwd;
    }

    private void DrawGlobalOverlay()
    {
        var label = $"FPS: {Raylib.GetFPS()} | Scene: {SceneManager.Current?.Id ?? "None"}";
        Raylib.DrawText(label, 12, 12, 18, Color.LightGray);
    }
}
