
import { useState } from "react";
import { Plus, Plug, Database, Link, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIntegrators, useCreateIntegrator, useUpdateIntegrator } from "@/hooks/useApiQueries";

// Map integration type to icon
const typeIcon = {
  data: Database,
  api: Link,
  tool: Plug,
  service: Mail,
};

const Integrations = () => {
  const { data: integratorsData, isLoading } = useIntegrators({ is_active: true });
  const createIntegratorMutation = useCreateIntegrator();
  const updateIntegratorMutation = useUpdateIntegrator();
  
  const [showNewIntegrationModal, setShowNewIntegrationModal] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    integrator_name: "",
    descriptions: "",
    integrator_type: "data",
    provider_name: "",
    auth_type: "API Key",
    icon_name: "",
  });
  const { toast } = useToast();

  const integrations = integratorsData?.data || [];

  const handleNewIntegration = () => {
    setShowNewIntegrationModal(true);
  };

  const handleToggle = async (integration: any) => {
    try {
      await updateIntegratorMutation.mutateAsync({
        ...integration,
        is_connected: !integration.is_connected
      });

      toast({
        title: integration.is_connected ? "Integration Disconnected" : "Integration Connected",
        description: `${integration.integrator_name} has been ${integration.is_connected ? "disconnected" : "connected"} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration status.",
        variant: "destructive"
      });
    }
  };

  const handleCreateIntegration = async () => {
    if (!newIntegration.integrator_name || !newIntegration.integrator_type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createIntegratorMutation.mutateAsync({
        ...newIntegration,
        is_connected: false,
        is_active: true
      });

      setNewIntegration({
        integrator_name: "",
        descriptions: "",
        integrator_type: "data",
        provider_name: "",
        auth_type: "API Key",
        icon_name: "",
      });
      setShowNewIntegrationModal(false);

      toast({
        title: "Integration Created",
        description: `${newIntegration.integrator_name} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create integration.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground">
            Manage your data connections and API integrations.
          </p>
        </div>
        <Button onClick={handleNewIntegration}>
          <Plus className="mr-2 h-4 w-4" /> Add Integration
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration: any) => {
          const Icon = typeIcon[integration.integrator_type as keyof typeof typeIcon] || Plug;
          return (
            <Card key={integration.integrator_id} className="animate-fade-in">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-accent" />
                  <CardTitle>{integration.integrator_name}</CardTitle>
                </div>
                <CardDescription>{integration.descriptions}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{integration.integrator_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider</span>
                    <span>{integration.provider_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Auth Type</span>
                    <span>{integration.auth_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={integration.is_connected ? "text-green-500" : "text-red-500"}>
                      {integration.is_connected ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant={integration.is_connected ? "destructive" : "default"} 
                    onClick={() => handleToggle(integration)}
                  >
                    {integration.is_connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Integration Modal */}
      <Dialog open={showNewIntegrationModal} onOpenChange={setShowNewIntegrationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Integration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Integration Name</Label>
              <Input 
                id="name" 
                value={newIntegration.integrator_name} 
                onChange={e => setNewIntegration({...newIntegration, integrator_name: e.target.value})}
                placeholder="E.g. Salesforce CRM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description"
                value={newIntegration.descriptions}
                onChange={e => setNewIntegration({...newIntegration, descriptions: e.target.value})}
                placeholder="What this integration does"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Integration Type</Label>
              <Select 
                value={newIntegration.integrator_type} 
                onValueChange={value => setNewIntegration({...newIntegration, integrator_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Input 
                id="provider"
                value={newIntegration.provider_name}
                onChange={e => setNewIntegration({...newIntegration, provider_name: e.target.value})}
                placeholder="E.g. Salesforce"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authType">Auth Type</Label>
              <Select 
                value={newIntegration.auth_type} 
                onValueChange={value => setNewIntegration({...newIntegration, auth_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="API Key">API Key</SelectItem>
                  <SelectItem value="OAuth">OAuth</SelectItem>
                  <SelectItem value="Basic Auth">Basic Auth</SelectItem>
                  <SelectItem value="Token">Token</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input 
                id="icon"
                value={newIntegration.icon_name}
                onChange={e => setNewIntegration({...newIntegration, icon_name: e.target.value})}
                placeholder="Icon identifier"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewIntegrationModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateIntegration}>
              Create Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Integrations;
