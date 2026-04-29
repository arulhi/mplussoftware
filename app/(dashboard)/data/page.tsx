"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getCurrentUser, hasPermission } from "@/lib/rbac";
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  Vehicle,
} from "@/lib/vehicleStorage";

export default function DataPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [formData, setFormData] = useState({
    make_Name: "",
    model_Name: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortField, setSortField] = useState<keyof Vehicle | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setIsSuperadmin(user.role === "superadmin");
        setCanEdit(hasPermission(user, "data:edit") || user.role === "superadmin");
        setCanDelete(hasPermission(user, "data:delete") || user.role === "superadmin");
      }
    }
  }, []);

  const loadVehicles = async (makeName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = makeName
        ? `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${makeName}?format=json`
        : "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/toyota?format=json";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      const apiVehicles = data.Results || [];

      const localVehicles = getVehicles();
      const combined = [...localVehicles, ...apiVehicles];

      setVehicles(combined);
      setFilteredVehicles(combined);
    } catch (err: any) {
      setError("Failed to fetch vehicle data. Please try again.");
      toast({ variant: "destructive", description: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

  const loadVehicleDetail = async (makeId: number, modelId: number) => {
    setDetailLoading(true);
    try {
      const localVehicle = getVehicleById(makeId, modelId);
      if (localVehicle) {
        setSelectedVehicle(localVehicle as any);
      } else {
        const res = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/${makeId}?format=json`
        );
        const data = await res.json();
        const detail = data.Results?.find(
          (v: any) => v.Model_ID === modelId
        );
        setSelectedVehicle(detail || null);
      }
    } catch (err) {
      toast({ variant: "destructive", description: "Failed to fetch detail" });
    } finally {
      setDetailLoading(false);
    }
  };

  const triggerError = () => {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      throw new Error("This is a dummy error for testing!");
    }, 100);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const sortVehicles = (vehiclesToSort: Vehicle[]) => {
    if (!sortField) return vehiclesToSort;
    
    return [...vehiclesToSort].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
  };

  useEffect(() => {
    if (search) {
      const filtered = vehicles.filter(
        (v) =>
          v.Make_Name.toLowerCase().includes(search.toLowerCase()) ||
          v.Model_Name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredVehicles(sortVehicles(filtered));
      setCurrentPage(1);
    } else {
      setFilteredVehicles(sortVehicles(vehicles));
    }
  }, [search, vehicles, sortField, sortDirection]);

  const handleSort = (field: keyof Vehicle) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: keyof Vehicle) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredVehicles.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const handleCreate = () => {
    setFormData({ make_Name: "", model_Name: "" });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      make_Name: vehicle.Make_Name,
      model_Name: vehicle.Model_Name,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = () => {
    if (!formData.make_Name || !formData.model_Name) {
      toast({ variant: "destructive", description: "Please fill all fields" });
      return;
    }
    createVehicle({
      Make_Name: formData.make_Name,
      Model_Name: formData.model_Name,
    });
    toast({ description: "Vehicle created successfully (saved to localStorage)" });
    setIsCreateDialogOpen(false);
    loadVehicles();
    setCurrentPage(1);
  };

  const handleEditSubmit = () => {
    if (!selectedVehicle || !formData.make_Name || !formData.model_Name) {
      toast({ variant: "destructive", description: "Please fill all fields" });
      return;
    }
    updateVehicle(selectedVehicle.Make_ID, selectedVehicle.Model_ID, {
      Make_Name: formData.make_Name,
      Model_Name: formData.model_Name,
    });
    toast({ description: "Vehicle updated successfully" });
    setIsEditDialogOpen(false);
    loadVehicles();
  };

  const handleDeleteConfirm = () => {
    if (selectedVehicle) {
      deleteVehicle(selectedVehicle.Make_ID, selectedVehicle.Model_ID);
      toast({ description: "Vehicle deleted successfully" });
      setIsDeleteDialogOpen(false);
      loadVehicles();
    }
  };


  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Vehicle Data (VPIC API)</h1>
        <div className="flex gap-2">
          {isSuperadmin && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          )}
          <Button variant="destructive" onClick={triggerError}>
            <AlertCircle className="mr-2 h-4 w-4" />
            Trigger Error
          </Button>
        </div>
      </div>

      {showError && (
        <div className="border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>Error triggered! Check console for details.</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="min-w-[150px]">Vehicle Models {!isSuperadmin && "(View Only)"}</CardTitle>
            <Input
              placeholder="Search make or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted select-none"
                      onClick={() => handleSort("Make_ID")}
                    >
                      Make ID {getSortIcon("Make_ID")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted select-none"
                      onClick={() => handleSort("Make_Name")}
                    >
                      Make Name {getSortIcon("Make_Name")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted select-none"
                      onClick={() => handleSort("Model_ID")}
                    >
                      Model ID {getSortIcon("Model_ID")}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted select-none"
                      onClick={() => handleSort("Model_Name")}
                    >
                      Model Name {getSortIcon("Model_Name")}
                    </TableHead>
                    <TableHead>Action {!isSuperadmin && "(View Only)"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((vehicle, index) => (
                    <TableRow key={startIndex + index}>
                      <TableCell>{vehicle.Make_ID}</TableCell>
                      <TableCell className="font-medium">
                        {vehicle.Make_Name}
                      </TableCell>
                      <TableCell>{vehicle.Model_ID}</TableCell>
                      <TableCell>{vehicle.Model_Name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              loadVehicleDetail(vehicle.Make_ID, vehicle.Model_ID);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Detail
                          </Button>
                          {canEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(vehicle)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(vehicle)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {!canEdit && !canDelete && (
                            <span className="text-xs text-muted-foreground">View only</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentItems.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalItems > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} vehicles
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Show:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 rounded border border-input bg-background text-sm"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {getPageNumbers().map((page, i) => (
                        <Button
                          key={i}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => typeof page === "number" && setCurrentPage(page)}
                          disabled={typeof page === "string"}
                          className={typeof page === "string" ? "cursor-default" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vehicle Detail</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedVehicle ? (
            <div className="space-y-4 py-4">
              <div>
                <span className="text-sm text-muted-foreground">Make ID</span>
                <p className="text-lg font-medium">{selectedVehicle.Make_ID}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Make Name</span>
                <p className="text-lg font-medium">{selectedVehicle.Make_Name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Model ID</span>
                <p className="text-lg font-medium">{selectedVehicle.Model_ID}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Model Name</span>
                <p className="text-lg font-medium">{selectedVehicle.Model_Name}</p>
              </div>
            </div>
          ) : (
            <p>No detail available</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="makeName">Make Name</Label>
              <Input
                id="makeName"
                value={formData.make_Name}
                onChange={(e) =>
                  setFormData({ ...formData, make_Name: e.target.value })
                }
                placeholder="Enter make name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelName">Model Name</Label>
              <Input
                id="modelName"
                value={formData.model_Name}
                onChange={(e) =>
                  setFormData({ ...formData, model_Name: e.target.value })
                }
                placeholder="Enter model name"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editMakeName">Make Name</Label>
              <Input
                id="editMakeName"
                value={formData.make_Name}
                onChange={(e) =>
                  setFormData({ ...formData, make_Name: e.target.value })
                }
                placeholder="Enter make name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editModelName">Model Name</Label>
              <Input
                id="editModelName"
                value={formData.model_Name}
                onChange={(e) =>
                  setFormData({ ...formData, model_Name: e.target.value })
                }
                placeholder="Enter model name"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete vehicle &quot;{selectedVehicle?.Make_Name} {selectedVehicle?.Model_Name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
