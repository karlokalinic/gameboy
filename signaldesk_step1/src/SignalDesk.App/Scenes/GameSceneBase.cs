using SignalDesk.App.Infrastructure;

namespace SignalDesk.App.Scenes;

public abstract class GameSceneBase : IGameScene
{
    protected GameSceneBase(GameHost host)
    {
        Host = host;
    }

    protected GameHost Host { get; }

    public abstract string Id { get; }

    public virtual void Enter()
    {
    }

    public virtual void Exit()
    {
    }

    public abstract void Update(float dt);

    public abstract void Draw();
}
