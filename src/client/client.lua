--#region Configuration

local serverUrl = "http://localhost:3000/"
local distanceMultiplier = 0.9
-- If you are experiencing artifacts you can try using different coords.
local coords = vec4(-2500.0, -2500.0, 100.0, 75.0)
-- local coords = vec4(-2500.0, -2500.0, 500.0, 75.0)

--#endregion

---@param name string | nil
---@return table
local function Screenshot(name)
    local Promise = promise.new()
    local _url = serverUrl .. "upload" .. (name and "/" .. name)
    print(_url)
    exports['screenshot-basic']:requestScreenshotUpload(_url, 'image', function(data)
        Promise:resolve(json.decode(data))
    end)
    local data = Citizen.Await(Promise)
    return data
end

---@param coords vector3
---@return number
local function CreateCamera(coords)
    local _camera = CreateCam("DEFAULT_SCRIPTED_CAMERA", true)
    SetCamCoord(_camera, coords.x + 1, coords.y + 1, coords.z + 1)
    SetCamFov(_camera, 50.0)
    RenderScriptCams(true, false, 0, true, false)
    return _camera
end

---@param v vector3
---@return vector3
local function vec3abs(v)
    return vector3(
        math.abs(v.x),
        math.abs(v.y),
        math.abs(v.z)
    )
end

---@param min vector3
---@param max vector3
local function GetDistance(min, max)
    local _min = vec3abs(min)
    local _max = vec3abs(max)

    local distance = (_min.x + _max.x + _min.y + _max.y + _min.z + _max.z + 1.0) * distanceMultiplier
    return distance
end

---@param entity number
---@param name string
local function ScreenshotEntity(entity, name)
    local model = GetEntityModel(entity)
    local min, max = GetModelDimensions(model)
    local distance = GetDistance(min, max)

    local camera = CreateCamera(GetEntityCoords(PlayerPedId()))
    local camCoords = vec3(coords.x + distance, coords.y, coords.z + (distance / 1.5))
    SetCamCoord(camera, camCoords.x, camCoords.y, camCoords.z)
    PointCamAtCoord(camera, coords.x, coords.y, coords.z + (max.z - min.z) / 2)

    Wait(500)
    local data = Screenshot(name)
    RenderScriptCams(false, false, 0, true, false)

    return data
end

---@param name string
---@return table
local function ScreenshotModel(name)
    local model = joaat(name)
    lib.requestModel(model)

    local object = CreateObject(model, coords.x, coords.y, coords.z, false, true, false)
    SetEntityHeading(object, coords.w)
    FreezeEntityPosition(object, true)

    local data = ScreenshotEntity(object, name)
    DeleteEntity(object)

    return data
end

---@param name string
---@return table
local function ScreenshotVehicle(name)
    local model = joaat(name)
    lib.requestModel(model)

    local vehicle = CreateVehicle(model, coords.x, coords.y, coords.z, coords.w + 160.0, false, true)
    FreezeEntityPosition(vehicle, true)

    local data = ScreenshotEntity(vehicle, name)
    DeleteEntity(vehicle)

    return data
end

RegisterCommand("screenmodel", function(source, args, rawCommand)
    print(json.encode(ScreenshotModel(args[1]), { indent = true }))
end, false)

RegisterCommand("screenvehicle", function(source, args, rawCommand)
    print(json.encode(ScreenshotVehicle(args[1]), { indent = true }))
end, false)

RegisterCommand("screenallmodels", function(source, args, rawCommand)
    for _, category in pairs(Props) do
        for _, name in pairs(category) do
            ScreenshotModel(name)
        end
    end
end, false)

RegisterCommand("screenallvehicles", function(source, args, rawCommand)
    for _, vehicle in pairs(GetAllVehicleModels()) do
        ScreenshotVehicle(vehicle)
    end
end, false)
