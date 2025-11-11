import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';

interface AuthPageProps {
  onLogin: (email: string, name: string) => void;
  defaultToLogin?: boolean;
}

export function AuthPage({ onLogin, defaultToLogin = false }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(defaultToLogin);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      // Sign up validation
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    // Simulate successful auth with delay
    setIsLoading(true);
    const userName = formData.name || formData.email.split('@')[0];
    toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
    
    setTimeout(() => {
      onLogin(formData.email, userName);
      setIsLoading(false);
    }, 500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    toast.success('Google sign-in successful!');
    
    setTimeout(() => {
      onLogin('user@gmail.com', 'Demo User');
      setIsLoading(false);
    }, 500);
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    toast.success('Facebook sign-in successful!');
    
    setTimeout(() => {
      onLogin('user@facebook.com', 'Demo User');
      setIsLoading(false);
    }, 500);
  };

  const handleXLogin = () => {
    setIsLoading(true);
    toast.success('X sign-in successful!');
    
    setTimeout(() => {
      onLogin('user@x.com', 'Demo User');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image with Overlay - Different for Login vs Sign Up */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: isLogin 
            ? `url('https://images.unsplash.com/photo-1665583146353-0d9eabb68c65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXJ0JTIwYmlrZSUyMHJhY2luZyUyMGFjdGlvbnxlbnwxfHx8fDE3NjA4NTcwMDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            : `url('https://images.unsplash.com/photo-1721016955607-2fe31a9de932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjByaWRlciUyMGp1bXBpbmd8ZW58MXx8fHwxNzYwODU3MjYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/75" />

      {/* Content */}
      <div className="relative w-full max-w-md z-10">
        {/* Logo & Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-white tracking-[0.25em] sm:tracking-[0.3em] mb-2 text-2xl sm:text-3xl">ENDURO LAB</h1>
          <p className="text-slate-300 text-sm sm:text-base">Unleash Your Racing Potential</p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg p-6 sm:p-8 shadow-2xl border border-slate-800">{isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Social Login Buttons */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12 sm:h-12 gap-2 text-sm sm:text-base disabled:opacity-50"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="truncate">Continue with Google</span>
              </Button>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                  className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white h-12 sm:h-12 gap-2 text-sm sm:text-base disabled:opacity-50"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                  <span className="sm:hidden">FB</span>
                </Button>

                <Button
                  type="button"
                  onClick={handleXLogin}
                  disabled={isLoading}
                  className="flex-1 bg-black hover:bg-slate-900 text-white h-12 sm:h-12 gap-2 text-sm sm:text-base disabled:opacity-50"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-slate-900/90 text-slate-400">or</span>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-slate-300 text-sm block">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-11 sm:h-12"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-slate-300 text-sm block">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-11 sm:h-12"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-slate-600 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                  />
                  <label htmlFor="remember" className="text-xs sm:text-sm text-slate-300 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-xs sm:text-sm text-teal-400 hover:text-teal-300 whitespace-nowrap"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white h-11 sm:h-12 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-xs sm:text-sm text-slate-400 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-teal-400 hover:text-teal-300 underline"
                >
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Header */}
              <div className="text-center pb-2">
                <h2 className="text-white text-xl sm:text-2xl mb-2">Join the Lab</h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  Get access to premium dirt bike<br />parts, rentals and racing insights
                </p>
              </div>

              {/* Full Name Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-slate-300 text-sm block">Full name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-11 sm:h-12"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-slate-300 text-sm block">Email Address</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-11 sm:h-12"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-slate-300 text-sm block">Password</label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-11 sm:h-12"
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-slate-300 text-sm block">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-11 sm:h-12"
                  required
                />
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white h-11 sm:h-12 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Sign In Link */}
              <p className="text-center text-xs sm:text-sm text-slate-400 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-teal-400 hover:text-teal-300 underline"
                >
                  Sign in
                </button>
              </p>

              {/* Terms */}
              <p className="text-xs sm:text-sm text-slate-500 text-center leading-relaxed pt-2">
                By signing up, you agree to the{' '}
                <button type="button" className="text-teal-400 hover:text-teal-300 underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-teal-400 hover:text-teal-300 underline">Privacy Policy</button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs sm:text-sm mt-4 sm:mt-6">
          Powered by racing passion since 2025
        </p>
      </div>
    </div>
  );
}