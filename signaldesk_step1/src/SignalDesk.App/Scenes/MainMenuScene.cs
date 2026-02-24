using Raylib_cs;
using SignalDesk.App.Infrastructure;

namespace SignalDesk.App.Scenes;

public sealed class MainMenuScene : GameSceneBase
{
    public MainMenuScene(GameHost host) : base(host)
    {
    }

    public override string Id => "main_menu";

    public override void Update(float dt)
    {
        // Immediate mode menu handling is done in Draw for this prototype phase.
    }

    public override void Draw()
    {
        Raylib.DrawText("SignalDesk", 70, 80, 56, Color.RayWhite);
        Raylib.DrawText("Prototype Runtime Bootstrap", 72, 152, 28, Color.LightGray);

        if (UiElements.Button(new Rectangle(72, 260, 340, 56), "New Session"))
        {
            Host.SceneManager.Replace(new SetupScene(Host));
        }

        UiElements.Button(new Rectangle(72, 330, 340, 56), "Continue (Soon)");

        if (UiElements.Button(new Rectangle(72, 400, 340, 56), "Exit"))
        {
            Raylib.CloseWindow();
        }
    }
}
