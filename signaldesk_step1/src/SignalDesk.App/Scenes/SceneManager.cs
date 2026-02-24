namespace SignalDesk.App.Scenes;

public sealed class SceneManager
{
    private readonly Stack<IGameScene> _stack = new();

    public IGameScene? Current => _stack.Count > 0 ? _stack.Peek() : null;

    public void Push(IGameScene scene)
    {
        _stack.Push(scene);
        scene.Enter();
    }

    public void Replace(IGameScene scene)
    {
        if (_stack.Count > 0)
        {
            _stack.Pop().Exit();
        }

        Push(scene);
    }

    public void Pop()
    {
        if (_stack.Count == 0)
        {
            return;
        }

        _stack.Pop().Exit();
    }

    public void Update(float dt)
    {
        Current?.Update(dt);
    }

    public void Draw()
    {
        Current?.Draw();
    }

    public void Clear()
    {
        while (_stack.Count > 0)
        {
            _stack.Pop().Exit();
        }
    }
}
