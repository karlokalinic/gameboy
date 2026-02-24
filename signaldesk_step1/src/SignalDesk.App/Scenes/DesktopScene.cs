using Raylib_cs;
using SignalDesk.App.Infrastructure;

namespace SignalDesk.App.Scenes;

public sealed class DesktopScene : GameSceneBase
{
    private readonly string _archetype;

    public DesktopScene(GameHost host, string archetype) : base(host)
    {
        _archetype = archetype;
    }

    public override string Id => "desktop";

    public override void Update(float dt)
    {
    }

    public override void Draw()
    {
        Raylib.DrawRectangle(40, 60, 1520, 800, new Color(25, 32, 44, 255));
        Raylib.DrawRectangleLines(40, 60, 1520, 800, new Color(90, 110, 132, 255));

        Raylib.DrawText("Desktop Runtime (Phase B)", 62, 82, 36, Color.RayWhite);
        Raylib.DrawText($"Archetype: {_archetype}", 64, 130, 24, Color.LightGray);
        Raylib.DrawText("Next phases wire scenario runtime, draggable panels, checks, and saves.", 64, 168, 22, Color.Gray);

        if (UiElements.Button(new Rectangle(64, 760, 210, 46), "Back to Menu"))
        {
            Host.SceneManager.Replace(new MainMenuScene(Host));
        }
    }
}
