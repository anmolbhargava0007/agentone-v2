
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeOff } from "lucide-react";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";

const Signup = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_pwd: "",
    user_mobile: "",
    gender: "",
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_name || !formData.user_email || !formData.user_pwd || !formData.user_mobile || !formData.gender) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success("Account created successfully! Please login to continue.");
        navigate("/login");
      } else {
        toast.error(data.msg || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/images/e2a2616f-9ef6-4227-bad9-420362a39663.png" 
              alt="Agent One Logo" 
              className="h-16"
            />
          </div>
          <p className="text-muted-foreground mt-2">
            AI Accelerator Platform for Enterprise Deployment
          </p>
        </div>
        
        <Card className="w-full shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold">Create Account</h2>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user_name">Full Name</Label>
                <Input
                  id="user_name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.user_name}
                  onChange={(e) => handleInputChange('user_name', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user_email">Email</Label>
                <Input
                  id="user_email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.user_email}
                  onChange={(e) => handleInputChange('user_email', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user_mobile">Mobile Number</Label>
                <Input
                  id="user_mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.user_mobile}
                  onChange={(e) => handleInputChange('user_mobile', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user_pwd">Password</Label>
                <div className="relative">
                  <Input
                    id="user_pwd"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.user_pwd}
                    onChange={(e) => handleInputChange('user_pwd', e.target.value)}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
