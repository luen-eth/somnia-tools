import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { MultiSender } from '@/components/MultiSender';

export default function MultiSenderPage() {
  return (
    <div className="min-h-screen bg-dark-950 relative">
      <AnimatedBackground />
      <Navbar />
      
      <main className="py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-[fadeInScale_1s_ease-out]">
              <span className="gradient-text glow-effect">Multi Sender</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-[slideInUp_1s_ease-out_0.3s_both]">
              Send tokens to multiple addresses in a single transaction. 
              Save on gas fees and speed up your operations.
            </p>
          </div>
          
          <MultiSender />
        </div>
      </main>
    </div>
  );
}
