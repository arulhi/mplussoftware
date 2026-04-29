export interface Vehicle {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

export interface VehicleDetail {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
  VehicleTypes: { VehicleTypeId: number; VehicleTypeName: string }[];
}

const STORAGE_KEY = "app_vehicles";

// Initialize with some default vehicles
const initializeDefaults = () => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEY)) {
    const defaultVehicles: Vehicle[] = [
      { Make_ID: 1, Make_Name: "Toyota", Model_ID: 1, Model_Name: "Camry" },
      { Make_ID: 1, Make_Name: "Toyota", Model_ID: 2, Model_Name: "Corola" },
      { Make_ID: 2, Make_Name: "Honda", Model_ID: 3, Model_Name: "Civic" },
      { Make_ID: 2, Make_Name: "Honda", Model_ID: 4, Model_Name: "Accord" },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultVehicles));
  }
};

export const getVehicles = (): Vehicle[] => {
  initializeDefaults();
  if (typeof window === "undefined") return [];
  const vehicles = localStorage.getItem(STORAGE_KEY);
  return vehicles ? JSON.parse(vehicles) : [];
};

export const getVehicleById = (makeId: number, modelId: number): Vehicle | undefined => {
  const vehicles = getVehicles();
  return vehicles.find(v => v.Make_ID === makeId && v.Model_ID === modelId);
};

export const getVehicleByIds = getVehicleById; // Alias for backward compatibility

export const createVehicle = (vehicle: Omit<Vehicle, "Make_ID" | "Model_ID">) => {
  const vehicles = getVehicles();
  const newVehicle: Vehicle = {
    ...vehicle,
    Make_ID: Date.now(), // Generate unique ID
    Model_ID: Date.now() + 1,
  };
  vehicles.push(newVehicle);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return newVehicle;
};

export const updateVehicle = (makeId: number, modelId: number, updates: Partial<Vehicle>) => {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.Make_ID === makeId && v.Model_ID === modelId);
  if (index !== -1) {
    vehicles[index] = { ...vehicles[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    return vehicles[index];
  }
  return null;
};

export const deleteVehicle = (makeId: number, modelId: number) => {
  const vehicles = getVehicles();
  const filtered = vehicles.filter(v => !(v.Make_ID === makeId && v.Model_ID === modelId));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
