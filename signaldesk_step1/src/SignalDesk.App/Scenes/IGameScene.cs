namespace SignalDesk.App.Scenes;

public interface IGameScene
{
    string Id { get; }
    void Enter();
    void Exit();
    void Update(float dt);
    void Draw();
}
