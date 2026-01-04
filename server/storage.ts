import { users, scripts, categories, type User, type InsertUser, type Script, type InsertScript, type Category, type InsertCategory } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getScripts(category?: string, search?: string): Promise<Script[]>;
  getScript(id: number): Promise<Script | undefined>;
  createScript(script: InsertScript): Promise<Script>;
  incrementScriptViews(id: number): Promise<void>;
  incrementScriptDownloads(id: number): Promise<void>;
  getFeaturedScripts(): Promise<Script[]>;
  getPopularScripts(): Promise<Script[]>;
  
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scripts: Map<number, Script>;
  private categories: Map<number, Category>;
  private userCurrentId: number;
  private scriptCurrentId: number;
  private categoryCurrentId: number;

  constructor() {
    this.users = new Map();
    this.scripts = new Map();
    this.categories = new Map();
    this.userCurrentId = 1;
    this.scriptCurrentId = 1;
    this.categoryCurrentId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categoriesData = [
      { name: "Все скрипты", slug: "all", icon: "fas fa-th-large", description: "Все доступные скрипты" },
      { name: "Игровые скрипты", slug: "game", icon: "fas fa-gamepad", description: "Скрипты для конкретных игр" },
      { name: "Утилиты", slug: "utility", icon: "fas fa-tools", description: "Общие скрипты-утилиты" },
      { name: "Админ скрипты", slug: "admin", icon: "fas fa-crown", description: "Административные инструменты" },
      { name: "Эксплойт скрипты", slug: "exploit", icon: "fas fa-bug", description: "Скрипты для обхода и эксплоитов" },
      { name: "GUI скрипты", slug: "gui", icon: "fas fa-window-maximize", description: "Скрипты с графическим интерфейсом" },
    ];

    categoriesData.forEach(cat => {
      const category: Category = { ...cat, id: this.categoryCurrentId++ };
      this.categories.set(category.id, category);
    });

    // Initialize scripts
    const scriptsData = [
      {
        name: "Infinite Jump Script",
        description: "Allows unlimited jumping in any Roblox game. Perfect for parkour games and exploration.",
        category: "game",
        code: `-- Infinite Jump Script
local player = game.Players.LocalPlayer
local UserInputService = game:GetService("UserInputService")
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.Space then
        humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
    end
end)`,
        views: 1200,
        downloads: 856,
        rating: 49,
        isPopular: true,
        isNew: false,
        isFeatured: false,
        status: "Popular"
      },
      {
        name: "Admin Commands Hub",
        description: "Comprehensive admin commands system with GUI. Includes kick, ban, teleport, and more.",
        category: "admin",
        code: `-- Admin Commands System
local adminGui = Instance.new("ScreenGui")
local mainFrame = Instance.new("Frame")
local commands = {
    kick = function(player)
        if player then
            player:Kick("Kicked by admin")
        end
    end,
    ban = function(player)
        -- Ban implementation
    end,
    teleport = function(player1, player2)
        -- Teleport implementation
    end
}

-- GUI Implementation
adminGui.Name = "AdminCommands"
adminGui.Parent = game.Players.LocalPlayer:WaitForChild("PlayerGui")`,
        views: 892,
        downloads: 445,
        rating: 47,
        isPopular: false,
        isNew: true,
        isFeatured: false,
        status: "New"
      },
      {
        name: "Speed Boost Utility",
        description: "Customizable speed boost script with GUI controls. Adjust walkspeed and jumppower dynamically.",
        category: "utility",
        code: `-- Speed Boost Script
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

-- Default values
local originalWalkSpeed = humanoid.WalkSpeed
local originalJumpPower = humanoid.JumpPower

-- Speed controls
local function setSpeed(speed)
    humanoid.WalkSpeed = speed
end

local function setJumpPower(power)
    humanoid.JumpPower = power
end

-- GUI controls included in full version
setSpeed(100) -- Adjustable`,
        views: 2100,
        downloads: 1300,
        rating: 48,
        isPopular: true,
        isNew: false,
        isFeatured: false,
        status: "Verified"
      },
      {
        name: "Universal ESP GUI",
        description: "Advanced ESP system with customizable GUI. See players through walls with distance indicators.",
        category: "gui",
        code: `-- ESP GUI System
local espEnabled = true
local espFolder = Instance.new("Folder")
espFolder.Name = "ESP"
espFolder.Parent = workspace

local function createESP(player)
    if player == game.Players.LocalPlayer then return end
    
    local highlight = Instance.new("Highlight")
    highlight.Parent = player.Character
    highlight.FillColor = Color3.fromRGB(0, 255, 136)
    highlight.OutlineColor = Color3.fromRGB(0, 255, 136)
    highlight.FillTransparency = 0.5
    highlight.OutlineTransparency = 0
end

-- Full GUI controls available in complete version
for _, player in pairs(game.Players:GetPlayers()) do
    createESP(player)
end`,
        views: 1800,
        downloads: 972,
        rating: 49,
        isPopular: false,
        isNew: false,
        isFeatured: false,
        status: "Premium"
      },
      {
        name: "Noclip Toggle",
        description: "Simple noclip script with toggle functionality. Walk through walls and objects with ease.",
        category: "exploit",
        code: `-- Noclip Toggle Script
local noclipEnabled = false
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local UserInputService = game:GetService("UserInputService")

local function toggleNoclip()
    noclipEnabled = not noclipEnabled
    
    if character then
        for _, part in pairs(character:GetChildren()) do
            if part:IsA("BasePart") then
                part.CanCollide = not noclipEnabled
            end
        end
    end
end

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.N then
        toggleNoclip()
    end
end)`,
        views: 3200,
        downloads: 2100,
        rating: 46,
        isPopular: true,
        isNew: false,
        isFeatured: false,
        status: "Updated"
      },
      {
        name: "Aimbot System",
        description: "Advanced aimbot with customizable settings. Works with most FPS games on Roblox.",
        category: "game",
        code: `-- Aimbot System
local aimEnabled = true
local player = game.Players.LocalPlayer
local camera = workspace.CurrentCamera
local mouse = player:GetMouse()

local function getClosestPlayer()
    local closestPlayer = nil
    local shortestDistance = math.huge
    
    for _, v in pairs(game.Players:GetPlayers()) do
        if v ~= player and v.Character and v.Character:FindFirstChild("Head") then
            local distance = (v.Character.Head.Position - camera.CFrame.Position).Magnitude
            if distance < shortestDistance then
                shortestDistance = distance
                closestPlayer = v
            end
        end
    end
    
    return closestPlayer
end

-- Advanced targeting implementation
-- Full system available in complete version`,
        views: 2700,
        downloads: 1500,
        rating: 44,
        isPopular: false,
        isNew: false,
        isFeatured: false,
        status: "Advanced"
      },
      {
        name: "Universal Script Hub",
        description: "The ultimate collection of scripts in one GUI. Includes admin commands, exploits, utilities, and more. Regular updates with new features.",
        category: "gui",
        code: `-- Universal Script Hub
local scriptHub = Instance.new("ScreenGui")
local mainFrame = Instance.new("Frame")
local titleLabel = Instance.new("TextLabel")
local scriptsFrame = Instance.new("ScrollingFrame")

scriptHub.Name = "UniversalScriptHub"
scriptHub.Parent = game.Players.LocalPlayer:WaitForChild("PlayerGui")

-- Main frame setup
mainFrame.Size = UDim2.new(0, 500, 0, 400)
mainFrame.Position = UDim2.new(0.5, -250, 0.5, -200)
mainFrame.BackgroundColor3 = Color3.fromRGB(26, 26, 26)
mainFrame.BorderSizePixel = 0
mainFrame.Parent = scriptHub

-- Title
titleLabel.Size = UDim2.new(1, 0, 0, 50)
titleLabel.Text = "Universal Script Hub"
titleLabel.TextColor3 = Color3.fromRGB(0, 255, 136)
titleLabel.TextScaled = true
titleLabel.Font = Enum.Font.GothamBold
titleLabel.Parent = mainFrame

-- Full implementation with all features available`,
        views: 15200,
        downloads: 15200,
        rating: 49,
        isPopular: true,
        isNew: false,
        isFeatured: true,
        status: "Featured"
      },
      {
        name: "Advanced Exploit Suite",
        description: "Professional-grade exploit tools with advanced features. Perfect for experienced users looking for powerful functionality.",
        category: "exploit",
        code: `-- Advanced Exploit Suite
local exploitSuite = {}
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()

-- Advanced exploit functions
exploitSuite.godMode = function()
    local humanoid = character:WaitForChild("Humanoid")
    humanoid.MaxHealth = math.huge
    humanoid.Health = math.huge
end

exploitSuite.infiniteYield = function()
    -- Infinite yield implementation
    loadstring(game:HttpGet("https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source"))()
end

exploitSuite.serverHop = function()
    -- Server hop implementation
    local TeleportService = game:GetService("TeleportService")
    local PlaceId = game.PlaceId
    TeleportService:Teleport(PlaceId, player)
end

-- Professional-grade tools with advanced features
-- Full suite available in complete version`,
        views: 8700,
        downloads: 8700,
        rating: 48,
        isPopular: true,
        isNew: false,
        isFeatured: true,
        status: "Editor's Choice"
      },
      {
        name: "R4D Hub",
        description: "Популярный universal скрипт hub с поддержкой множества игр",
        category: "universal",
        code: `-- R4D Hub Script
-- Universal hub для множества игр
loadstring(game:HttpGet("https://raw.githubusercontent.com/R4DHubDev/R4D-Hub/main/script.lua"))()

-- Поддерживаемые игры:
-- • Arsenal
-- • Phantom Forces
-- • Jailbreak
-- • Adopt Me
-- • Bloxburg
-- • Brookhaven
-- • Murder Mystery 2
-- • Big Paintball
-- • Counter Blox
-- • Legends of Speed
-- • Mad City
-- • Natural Disaster Survival
-- • Piggy
-- • Tower of Hell
-- • Work at a Pizza Place
-- • Prison Life
-- • Flee the Facility
-- • Breaking Point
-- • Strucid
-- • Super Hero Tycoon

-- Функции:
-- • Aimbot для shooter игр
-- • ESP (показать игроков через стены)
-- • Teleport функции
-- • Auto farm для tycoon игр
-- • Speed boost
-- • Jump boost
-- • Fly mode
-- • Noclip
-- • Infinite ammo
-- • God mode
-- • Auto collect для simulator игр
-- • Custom scripts для каждой игры

-- Интерфейс:
-- • Простой GUI
-- • Кнопки для быстрого доступа
-- • Настройки для каждой функции
-- • Автоматическое определение игры
-- • Сохранение настроек
-- • Темная тема`,
        views: 8950,
        downloads: 7240,
        rating: 46,
        isPopular: true,
        isNew: false,
        isFeatured: false,
        status: "Popular"
      }
    ];

    scriptsData.forEach(script => {
      const scriptData: Script = { ...script, id: this.scriptCurrentId++, image: null };
      this.scripts.set(scriptData.id, scriptData);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Script methods
  async getScripts(category?: string, search?: string): Promise<Script[]> {
    let scripts = Array.from(this.scripts.values());
    
    if (category && category !== "all") {
      scripts = scripts.filter(script => script.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      scripts = scripts.filter(script => 
        script.name.toLowerCase().includes(searchLower) ||
        script.description.toLowerCase().includes(searchLower)
      );
    }
    
    return scripts.sort((a, b) => b.views - a.views);
  }

  async getScript(id: number): Promise<Script | undefined> {
    return this.scripts.get(id);
  }

  async createScript(insertScript: InsertScript): Promise<Script> {
    const id = this.scriptCurrentId++;
    const script: Script = { 
      ...insertScript, 
      id,
      views: 0,
      downloads: 0,
      rating: 0,
      isPopular: false,
      isNew: true,
      isFeatured: false,
      status: insertScript.status || "active",
      image: insertScript.image || null
    };
    this.scripts.set(id, script);
    return script;
  }

  async incrementScriptViews(id: number): Promise<void> {
    const script = this.scripts.get(id);
    if (script) {
      script.views++;
      this.scripts.set(id, script);
    }
  }

  async incrementScriptDownloads(id: number): Promise<void> {
    const script = this.scripts.get(id);
    if (script) {
      script.downloads++;
      this.scripts.set(id, script);
    }
  }

  async getFeaturedScripts(): Promise<Script[]> {
    return Array.from(this.scripts.values()).filter(script => script.isFeatured);
  }

  async getPopularScripts(): Promise<Script[]> {
    return Array.from(this.scripts.values())
      .filter(script => script.isPopular)
      .sort((a, b) => b.views - a.views);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null
    };
    this.categories.set(id, category);
    return category;
  }
}

export const storage = new MemStorage();
