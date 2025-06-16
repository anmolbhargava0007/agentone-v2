
import { useState } from "react";
import { Plus, ShieldCheck, ShieldAlert, Shield, Info, Edit, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  useGuardrails, 
  useCreateGuardrail, 
  useUpdateGuardrail, 
  useDeleteGuardrail,
  useGuardrailRules,
  useCreateGuardrailRule,
  useUpdateGuardrailRule,
  useDeleteGuardrailRule
} from "@/hooks/useApiQueries";

const typeInfo = {
  content: {
    label: "Content",
    icon: Shield,
    style: "bg-purple-100 text-purple-800"
  },
  security: {
    label: "Security", 
    icon: ShieldCheck,
    style: "bg-green-100 text-green-800"
  },
  compliance: {
    label: "Compliance",
    icon: ShieldAlert,
    style: "bg-blue-100 text-blue-800"
  },
  ethics: {
    label: "Ethics",
    icon: AlertCircle,
    style: "bg-orange-100 text-orange-800"
  },
  performance: {
    label: "Performance",
    icon: Info,
    style: "bg-yellow-100 text-yellow-800"
  },
};

const Guardrails = () => {
  const { data: guardrailsData, isLoading: guardrailsLoading } = useGuardrails({ is_active: true });
  const { data: rulesData } = useGuardrailRules({ is_active: true });
  const createGuardrailMutation = useCreateGuardrail();
  const updateGuardrailMutation = useUpdateGuardrail();
  const deleteGuardrailMutation = useDeleteGuardrail();
  const createRuleMutation = useCreateGuardrailRule();
  const updateRuleMutation = useUpdateGuardrailRule();
  const deleteRuleMutation = useDeleteGuardrailRule();

  const [isNewGuardrailModalOpen, setIsNewGuardrailModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedGuardrail, setSelectedGuardrail] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  
  const [newGuardrail, setNewGuardrail] = useState({
    guardrail_name: "",
    descriptions: "",
    guardrail_type: "content",
  });

  const [newRule, setNewRule] = useState({
    guardrail_rule_name: "",
    descriptions: "",
    conditions: "",
    actions: "",
  });
  
  const { toast } = useToast();

  // Transform API data to match component structure
  const guardrails = guardrailsData?.data || [];
  const rules = rulesData?.data || [];

  // Group rules by guardrail (you may need to implement guardrail-rule mapping)
  const getGuardrailRules = (guardrailId: number) => {
    // This would require the guardrail-rule-map API to link rules to guardrails
    return [];
  };

  const handleNewGuardrail = () => {
    setIsEditMode(false);
    setNewGuardrail({
      guardrail_name: "",
      descriptions: "",
      guardrail_type: "content",
    });
    setIsNewGuardrailModalOpen(true);
  };

  const handleEditGuardrail = (guardrail: any) => {
    setIsEditMode(true);
    setNewGuardrail({
      guardrail_name: guardrail.guardrail_name,
      descriptions: guardrail.descriptions,
      guardrail_type: guardrail.guardrail_type,
    });
    setSelectedGuardrail(guardrail);
    setIsNewGuardrailModalOpen(true);
  };

  const handleDeleteGuardrail = (guardrail: any) => {
    setSelectedGuardrail(guardrail);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGuardrail = async () => {
    if (selectedGuardrail) {
      try {
        await deleteGuardrailMutation.mutateAsync(selectedGuardrail.guardrail_id);
        toast({
          title: "Guardrail Deleted",
          description: `${selectedGuardrail.guardrail_name} has been removed.`,
        });
        setIsDeleteDialogOpen(false);
        setSelectedGuardrail(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete guardrail.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleGuardrail = async (guardrail: any) => {
    try {
      await updateGuardrailMutation.mutateAsync({
        ...guardrail,
        is_active: !guardrail.is_active
      });
      toast({
        title: "Guardrail Updated",
        description: "The guardrail settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update guardrail.",
        variant: "destructive"
      });
    }
  };

  const saveGuardrail = async () => {
    if (!newGuardrail.guardrail_name || !newGuardrail.descriptions) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and description for the guardrail.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditMode && selectedGuardrail) {
        await updateGuardrailMutation.mutateAsync({
          guardrail_id: selectedGuardrail.guardrail_id,
          ...newGuardrail,
          is_active: selectedGuardrail.is_active
        });
        toast({
          title: "Guardrail Updated",
          description: `${newGuardrail.guardrail_name} has been updated successfully.`,
        });
      } else {
        await createGuardrailMutation.mutateAsync({
          ...newGuardrail,
          is_active: true
        });
        toast({
          title: "Guardrail Created",
          description: `${newGuardrail.guardrail_name} has been added successfully.`,
        });
      }
      setIsNewGuardrailModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} guardrail.`,
        variant: "destructive"
      });
    }
  };

  const openAddRuleModal = (guardrail: any) => {
    setSelectedGuardrail(guardrail);
    setIsEditMode(false);
    setNewRule({
      guardrail_rule_name: "",
      descriptions: "",
      conditions: "",
      actions: "",
    });
    setIsRuleModalOpen(true);
  };

  const saveRule = async () => {
    if (!newRule.guardrail_rule_name || !newRule.conditions || !newRule.actions) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditMode && selectedRule) {
        await updateRuleMutation.mutateAsync({
          guardrail_rule_id: selectedRule.guardrail_rule_id,
          ...newRule,
          is_active: selectedRule.is_active
        });
        toast({
          title: "Rule Updated",
          description: `${newRule.guardrail_rule_name} has been updated successfully.`,
        });
      } else {
        await createRuleMutation.mutateAsync({
          ...newRule,
          is_active: true
        });
        toast({
          title: "Rule Added",
          description: `${newRule.guardrail_rule_name} has been added.`,
        });
      }
      setIsRuleModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} rule.`,
        variant: "destructive"
      });
    }
  };

  if (guardrailsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading guardrails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guardrails</h2>
          <p className="text-muted-foreground">
            Manage security, content, compliance, and ethical controls.
          </p>
        </div>
        <Button onClick={handleNewGuardrail}>
          <Plus className="mr-2 h-4 w-4" /> Add Guardrail
        </Button>
      </div>
      
      {guardrails.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/30">
          <Shield className="h-12 w-12 text-muted mb-4" />
          <h3 className="text-lg font-medium mb-2">No guardrails configured</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Guardrails protect your AI agents from generating harmful content and ensure compliance with regulations.
          </p>
          <Button onClick={handleNewGuardrail}>
            <Plus className="mr-2 h-4 w-4" /> Create Your First Guardrail
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guardrails.map((guardrail: any) => {
            const type = typeInfo[guardrail.guardrail_type as keyof typeof typeInfo] || typeInfo.content;
            const GuardrailIcon = type.icon;
            const guardrailRules = getGuardrailRules(guardrail.guardrail_id);
            
            return (
              <Card key={guardrail.guardrail_id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GuardrailIcon className="mr-2 h-5 w-5" />
                      {guardrail.guardrail_name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditGuardrail(guardrail)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => handleDeleteGuardrail(guardrail)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={guardrail.is_active}
                        onCheckedChange={() => toggleGuardrail(guardrail)}
                      />
                    </div>
                  </div>
                  <CardDescription>{guardrail.descriptions}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${type.style}`}>
                      {type.label}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted`}>
                      {guardrailRules.length} rules
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${guardrail.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {guardrail.is_active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => openAddRuleModal(guardrail)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Add Rule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Guardrail Modal */}
      <Dialog open={isNewGuardrailModalOpen} onOpenChange={setIsNewGuardrailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Guardrail" : "Add New Guardrail"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Modify your guardrail settings" 
                : "Create a new guardrail to ensure safety and compliance"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Guardrail Name</Label>
              <Input 
                id="name" 
                value={newGuardrail.guardrail_name} 
                onChange={e => setNewGuardrail({...newGuardrail, guardrail_name: e.target.value})}
                placeholder="E.g. PII Filter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={newGuardrail.descriptions}
                onChange={e => setNewGuardrail({...newGuardrail, descriptions: e.target.value})}
                placeholder="What this guardrail does"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Guardrail Type</Label>
              <Select 
                value={newGuardrail.guardrail_type} 
                onValueChange={value => setNewGuardrail({...newGuardrail, guardrail_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="ethics">Ethics</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewGuardrailModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveGuardrail}>
              {isEditMode ? "Update Guardrail" : "Create Guardrail"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rule Modal */}
      <Dialog open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Rule" : "Add New Rule"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Modify your rule settings" 
                : `Add a new rule to ${selectedGuardrail?.guardrail_name || "guardrail"}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input 
                id="rule-name" 
                value={newRule.guardrail_rule_name} 
                onChange={e => setNewRule({...newRule, guardrail_rule_name: e.target.value})}
                placeholder="E.g. Block PII"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-description">Description</Label>
              <Input 
                id="rule-description"
                value={newRule.descriptions}
                onChange={e => setNewRule({...newRule, descriptions: e.target.value})}
                placeholder="What this rule does"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Textarea 
                id="condition"
                value={newRule.conditions}
                onChange={e => setNewRule({...newRule, conditions: e.target.value})}
                placeholder="When this condition is met..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Textarea 
                id="action"
                value={newRule.actions}
                onChange={e => setNewRule({...newRule, actions: e.target.value})}
                placeholder="Take this action..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRule}>
              {isEditMode ? "Update Rule" : "Add Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Guardrail Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guardrail?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the guardrail
              "{selectedGuardrail?.guardrail_name}" and all its rules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGuardrail} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Guardrails;
