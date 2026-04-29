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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  Role,
} from "@/lib/localStorage";
import { PERMISSIONS } from "@/lib/localStorage";
import { getCurrentUser, hasPermission } from "@/lib/rbac";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setIsSuperadmin(user.role === "superadmin");
        setCanCreate(hasPermission(user, "roles:create") || user.role === "superadmin");
        setCanEdit(hasPermission(user, "roles:edit") || user.role === "superadmin");
        setCanDelete(hasPermission(user, "roles:delete") || user.role === "superadmin");
      }
    }
  }, []);

  const loadData = () => {
    setLoading(true);
    const rolesData = getRoles();
    setRoles(rolesData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedRole(null);
    setFormData({ name: "", description: "", permissions: [] });
    setIsDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permission),
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      toast({ variant: "destructive", description: "Please fill all required fields" });
      return;
    }

    if (formData.permissions.length === 0) {
      toast({ variant: "destructive", description: "Please select at least one permission" });
      return;
    }

    if (selectedRole) {
      updateRole(selectedRole.id, formData);
      toast({ description: "Role updated successfully" });
    } else {
      createRole(formData);
      toast({ description: "Role created successfully" });
    }

    setIsDialogOpen(false);
    loadData();
  };

  const handleConfirmDelete = () => {
    if (selectedRole) {
      deleteRole(selectedRole.id);
      toast({ description: "Role deleted successfully" });
      setIsDeleteDialogOpen(false);
      loadData();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Role Management {!isSuperadmin && "(View Only)"}
        </h1>
        {canCreate && (
          <Button onClick={handleCreate}>
            <Icon icon="mdi:shield-account-plus" className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Roles</CardTitle>
            <Input
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <Badge
                        variant={
                          role.name === "superadmin"
                            ? "default"
                            : role.name === "admin"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {role.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((p: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(role.createdAt).toLocaleDateString()}
                    </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {canEdit && role.name !== "superadmin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(role)}
                            >
                              <Icon icon="mdi:pencil" className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && role.name !== "superadmin" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(role)}
                            >
                              <Icon icon="mdi:trash" className="h-4 w-4" />
                            </Button>
                          )}
                          {!canEdit && !canDelete && (
                            <span className="text-xs text-muted-foreground">View only</span>
                          )}
                        </div>
                      </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? "Edit Role" : "Create Role"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter role name"
                disabled={selectedRole?.name === "superadmin"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {PERMISSIONS.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      checked={formData.permissions.includes(permission)}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission, checked as boolean)
                      }
                      disabled={
                        selectedRole?.name === "superadmin" &&
                        permission !== ""
                      }
                    />
                    <Label
                      htmlFor={permission}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Selected: {formData.permissions.length} permissions
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            {selectedRole?.name !== "superadmin" && (
              <Button onClick={handleSubmit}>
                {selectedRole ? "Update" : "Create"}
              </Button>
            )}
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
              This action will delete role &quot;{selectedRole?.name}&quot;.
              This action cannot be undone. Users with this role will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
