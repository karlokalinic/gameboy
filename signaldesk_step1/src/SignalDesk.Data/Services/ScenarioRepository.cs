using System.Text.Json;
using SignalDesk.Data.Models;

namespace SignalDesk.Data.Services;

public interface IScenarioRepository
{
    ScenarioDefinition LoadFromFile(string path);
    IReadOnlyList<string> GetScenarioFiles(string directoryPath);
}

public sealed class ScenarioRepository : IScenarioRepository
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        ReadCommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true
    };

    public ScenarioDefinition LoadFromFile(string path)
    {
        var json = File.ReadAllText(path);
        var scenario = JsonSerializer.Deserialize<ScenarioDefinition>(json, JsonOptions)
                      ?? throw new InvalidDataException($"Failed to deserialize scenario: {path}");
        return scenario;
    }

    public IReadOnlyList<string> GetScenarioFiles(string directoryPath)
        => Directory.Exists(directoryPath)
            ? Directory.GetFiles(directoryPath, "*.json", SearchOption.TopDirectoryOnly)
            : Array.Empty<string>();
}
