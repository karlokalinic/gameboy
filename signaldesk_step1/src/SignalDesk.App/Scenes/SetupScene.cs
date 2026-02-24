using Raylib_cs;
using SignalDesk.App.Infrastructure;

namespace SignalDesk.App.Scenes;

public sealed class SetupScene : GameSceneBase
{
    private readonly string[] _archetypes = ["Analyst", "Fixer", "Observer"];
    private int _selectedArchetype;

    public SetupScene(GameHost host) : base(host)
    {
    }

    public override string Id => "setup";

    public override void Update(float dt)
    {
    }

    public override void Draw()
    {
        Raylib.DrawText("Session Setup", 70, 80, 52, Color.RayWhite);
        Raylib.DrawText("Select archetype (placeholder for full creator)", 72, 150, 26, Color.LightGray);

        for (var i = 0; i < _archetypes.Length; i++)
        {
            var isSelected = i == _selectedArchetype;
            var label = isSelected ? $"> {_archetypes[i]}" : _archetypes[i];

            if (UiElements.Button(new Rectangle(72, 240 + (i * 66), 320, 52), label))
            {
                _selectedArchetype = i;
            }
        }

        if (UiElements.Button(new Rectangle(72, 460, 380, 56), "Enter Desktop Runtime"))
        {
            Host.SceneManager.Replace(new DesktopScene(Host, _archetypes[_selectedArchetype]));
        }

        if (UiElements.Button(new Rectangle(72, 530, 220, 56), "Back"))
        {
            Host.SceneManager.Replace(new MainMenuScene(Host));
        }
    }
}
