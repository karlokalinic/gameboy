using Raylib_cs;
using SignalDesk.App.Infrastructure;

namespace SignalDesk.App.Scenes;

public sealed class BootScene : GameSceneBase
{
    private float _elapsed;

    public BootScene(GameHost host) : base(host)
    {
    }

    public override string Id => "boot";

    public override void Update(float dt)
    {
        _elapsed += dt;

        if (_elapsed >= 0.75f)
        {
            Host.SceneManager.Replace(new MainMenuScene(Host));
        }
    }

    public override void Draw()
    {
        Raylib.DrawText("SignalDesk", 70, 80, 56, Color.RayWhite);
        Raylib.DrawText("Bootstrapping runtime services...", 72, 156, 28, Color.LightGray);
        Raylib.DrawText($"Root: {Host.RootPath}", 72, 212, 22, Color.Gray);
    }
}
