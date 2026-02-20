import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Factory, Send, Sparkles, Shield, Zap, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950 relative">
      <AnimatedBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-600/5"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-[fadeInScale_1s_ease-out]">
              <span className="gradient-text glow-effect">Somnia Tools</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-[slideInUp_1s_ease-out_0.3s_both]">
              Professional tools to simplify your token creation and bulk transfer 
              operations on BNB Smart Chain (BSC)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[slideInUp_1s_ease-out_0.6s_both]">
            <Link href="/factory">
              <Button size="lg" className="w-full sm:w-auto animate-[slideInLeft_1s_ease-out_0.8s_both]">
                <Factory className="mr-2 h-5 w-5" />
                Create Token
              </Button>
            </Link>
            <Link href="/multisender">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto animate-[slideInRight_1s_ease-out_0.8s_both]">
                <Send className="mr-2 h-5 w-5" />
                Bulk Send
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-[fadeInScale_1s_ease-out]">
              <span className="gradient-text">Features</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-[slideInUp_1s_ease-out_0.2s_both]">
              Find all the tools you need for your blockchain projects on a single platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            {/* Token Factory Card */}
            <Card className="group hover:scale-[1.02] transition-all  hover:glow-effect relative hover:z-20">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-primary-500/20 rounded-lg">
                    <Factory className="w-8 h-8 text-primary-400" />
                  </div>
                  <CardTitle>Token Factory</CardTitle>
                </div>
                <CardDescription>
                  Create professional ERC-20 tokens on BNB Smart Chain (BSC)
                  <br />
                  <span className="text-primary-400 text-sm font-medium">Fee: contract fee in BNB</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-primary-400" />
                    <span className="text-gray-300">Standard ERC-20 Token</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-primary-400" />
                    <span className="text-gray-300">Ownable Token</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-primary-400" />
                    <span className="text-gray-300">Mintable Token</span>
                  </div>
                </div>
                <Link href="/factory">
                  <Button className="w-full">
                    Start Creating Tokens
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Multi Sender Card */}
            <Card className="group hover:scale-[1.02] transition-all  hover:glow-effect  relative hover:z-20">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-primary-500/20 rounded-lg">
                    <Send className="w-8 h-8 text-primary-400" />
                  </div>
                  <CardTitle>Multi Sender</CardTitle>
                </div>
                <CardDescription>
                  Send tokens to multiple addresses in a single transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary-400" />
                    <span className="text-gray-300">Bulk Token Transfer</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-primary-400" />
                    <span className="text-gray-300">Same or Different Amounts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-primary-400" />
                    <span className="text-gray-300">Secure and Fast</span>
                  </div>
                </div>
                <Link href="/multisender">
                  <Button variant="secondary" className="w-full">
                    Start Bulk Transfer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

  
      {/* Footer */}
      <footer className="py-12 px-4 border-t border-primary-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="gradient-text text-xl font-bold">Somnia Tools</span>
          </div>
          <p className="text-gray-400 text-sm">
            Professional blockchain tools developed for BNB Smart Chain (BSC)
          </p>
        </div>
      </footer>
    </div>
  );
}
