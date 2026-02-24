using SignalDesk.App.Infrastructure;

namespace SignalDesk.App;

public static class Program
{
    public static void Main()
    {
        var host = new GameHost();

        try
        {
            host.Initialize();
            host.Run();
        }
        catch (Exception ex)
        {
            host.LogError("Fatal startup/runtime exception", ex);
            Console.Error.WriteLine(ex);
            Console.Error.WriteLine("\nSignalDesk crashed. See logs/runtime.log for details.");
            Console.Error.WriteLine("Press ENTER to close...");
            Console.ReadLine();
        }
    }
}
