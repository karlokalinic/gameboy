using System.Text.Json;
using SignalDesk.Core.Models;

namespace SignalDesk.Data.Services;

public interface ISaveService
{
    string GetSlotPath(int slot);
    void SaveSlot(GameState state, int slot);
    GameState LoadSlot(int slot);
    bool SlotExists(int slot);
}

public sealed class SaveService : ISaveService
{
    private readonly string _saveDirectory;
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    public SaveService(string saveDirectory)
    {
        _saveDirectory = saveDirectory;
        Directory.CreateDirectory(_saveDirectory);
    }

    public string GetSlotPath(int slot) => Path.Combine(_saveDirectory, $"slot{slot}.json");

    public void SaveSlot(GameState state, int slot)
    {
        var path = GetSlotPath(slot);
        var tmp = path + ".tmp";
        var json = JsonSerializer.Serialize(state, JsonOptions);
        File.WriteAllText(tmp, json);
        if (File.Exists(path)) File.Delete(path);
        File.Move(tmp, path);
    }

    public GameState LoadSlot(int slot)
    {
        var path = GetSlotPath(slot);
        if (!File.Exists(path)) throw new FileNotFoundException("Save slot not found", path);
        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<GameState>(json) ?? throw new InvalidDataException("Invalid save JSON");
    }

    public bool SlotExists(int slot) => File.Exists(GetSlotPath(slot));
}
