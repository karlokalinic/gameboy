using SignalDesk.App.Infrastructure;

namespace SignalDesk.App;

public static class Program
{
    public static void Main()
    {
        var host = new GameHost();
        host.Initialize();
        host.Run();
    }
}
