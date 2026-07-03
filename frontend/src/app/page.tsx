'use client';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { MotionDiv, MotionSection, staggerContainer, staggerItem, fadeInUp, scaleIn, AnimatePresence } from '@/components/MotionComponents';
import { HiArrowRight, HiCheckCircle, HiShieldCheck, HiCurrencyDollar, HiUserGroup, HiClock, HiChevronDown, HiStar } from 'react-icons/hi';

const faqs = [
  { q: 'What is TaskEarn Pro?', a: 'TaskEarn Pro is a platform where you earn real money by completing simple daily tasks like visiting websites.' },
  { q: 'How much can I earn daily?', a: 'You can earn up to ₦50 per day by completing 10 tasks at ₦5 each.' },
  { q: 'How do I get started?', a: 'Register an account, fund your wallet, purchase an investment plan, and start completing tasks immediately.' },
  { q: 'When can I withdraw?', a: 'Withdrawals are processed on Fridays only. Minimum withdrawal is ₦1,500.' },
  { q: 'Is there a referral program?', a: 'Yes! You earn a bonus for every user you refer who registers and purchases an investment plan.' },
];

const testimonials = [
  { name: 'Chioma O.', role: 'Premium Member', text: 'I earn ₦500 daily consistently. This platform has been a game changer for my finances!', rating: 5 },
  { name: 'Emeka O.', role: 'Active Member', text: 'Simple tasks, instant payments. I\'ve referred my friends and earn even more.', rating: 5 },
  { name: 'Aisha B.', role: 'Top Earner', text: 'Best platform for earning online. The support team is responsive and helpful.', rating: 5 },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [calcTasks, setCalcTasks] = useState(10);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 gradient-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center bg-accent-500/10 border border-accent-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse mr-2"></span>
                <span className="text-accent-400 text-sm font-medium">Earn ₦50 Daily</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Complete Simple Tasks,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                  Earn Real Money
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">
                Join thousands of Nigerians earning real cash by completing daily tasks. No special skills required. Start earning today!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="gradient-primary text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center gap-2 shadow-lg shadow-primary-500/25">
                  Start Earning Now <HiArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login" className="border border-gray-600 text-gray-300 px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/5 transition">
                  Sign In
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">10k+</p>
                  <p className="text-gray-400 text-sm">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">₦50M+</p>
                  <p className="text-gray-400 text-sm">Earnings Paid</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">5M+</p>
                  <p className="text-gray-400 text-sm">Tasks Done</p>
                </div>
              </div>
            </div>
            <div className="relative animate-float hidden lg:block">
              <div className="relative mx-auto max-w-md">
                <div className="gradient-primary rounded-3xl p-1">
                  <div className="bg-secondary-700 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-400 text-sm">Today&apos;s Tasks</span>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between bg-secondary-800 rounded-xl px-4 py-3">
                          <span className="text-gray-300 text-sm">Task #{i}</span>
                          <span className="text-accent-400 font-semibold text-sm">+₦5</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-accent-500/10 rounded-xl border border-accent-500/20">
                      <p className="text-accent-400 text-sm font-medium text-center">Complete all 10 tasks = ₦50 Today!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <MotionSection initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="py-20 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv variants={fadeInUp(0)} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Get started in 3 simple steps and begin earning real money today.</p>
          </MotionDiv>
          <MotionDiv variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {[
              { icon: HiUserGroup, title: 'Create Account', desc: 'Sign up for free and complete your profile to get started on your earning journey.' },
              { icon: HiShieldCheck, title: 'Fund Your Wallet', desc: 'Deposit funds and choose an investment plan to unlock daily tasks and earning potential.' },
              { icon: HiCurrencyDollar, title: 'Start Earning', desc: 'Complete 100 daily tasks and earn from your investment every single day!' },
            ].map((item, i) => (
              <MotionDiv key={i} variants={staggerItem} className="text-center p-8 rounded-2xl card-shadow hover:shadow-lg transition group bg-white dark:bg-secondary-800">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold text-secondary-700 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Earnings Calculator */}
      <MotionSection initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="py-20 bg-gray-50 dark:bg-secondary-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv variants={fadeInUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 dark:text-white mb-4">Earnings Calculator</h2>
            <p className="text-gray-500 dark:text-gray-400">See how much you can earn based on tasks completed daily.</p>
          </MotionDiv>
          <MotionDiv variants={scaleIn} className="bg-white dark:bg-secondary-800 rounded-2xl p-8 card-shadow">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Tasks Per Day</label>
              <input type="range" min="0" max="100" value={calcTasks} onChange={(e) => setCalcTasks(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500" />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>0</span>
                <span className="font-bold text-primary-500">{calcTasks}</span>
                <span>100</span>
              </div>
            </div>
            <MotionDiv variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                  { label: 'Per Task', value: `₦5` },
                { label: 'Daily Earnings', value: `₦${(calcTasks * 5).toLocaleString()}`, accent: true },
                { label: 'Weekly Earnings', value: `₦${(calcTasks * 5 * 7).toLocaleString()}` },
                { label: 'Monthly Earnings', value: `₦${(calcTasks * 5 * 30).toLocaleString()}`, accent: true },
              ].map((item, i) => (
                <MotionDiv key={i} variants={staggerItem} className={`p-4 rounded-xl ${item.accent ? 'gradient-primary text-white' : 'bg-gray-50 dark:bg-secondary-700'} text-center`}>
                  <p className={`text-sm ${item.accent ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>{item.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${item.accent ? 'text-white' : 'text-secondary-700 dark:text-white'}`}>{item.value}</p>
                </MotionDiv>
              ))}
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Features Section */}
      <MotionSection initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="py-20 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv variants={fadeInUp(0)} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 dark:text-white mb-4">Why Choose TaskEarn Pro?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We provide the best earning experience with transparency and reliability.</p>
          </MotionDiv>
          <MotionDiv variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HiCurrencyDollar, title: 'High Earnings', desc: 'Earn daily with simple tasks.' },
              { icon: HiClock, title: 'Quick Tasks', desc: 'Each task takes only 15-30 seconds.' },
              { icon: HiShieldCheck, title: 'Secure & Safe', desc: 'Your data and earnings are fully protected.' },
              { icon: HiUserGroup, title: 'Referral Bonus', desc: 'Earn extra by referring friends.' },
            ].map((item, i) => (
              <MotionDiv key={i} variants={staggerItem} className="text-center p-6 rounded-xl card-shadow hover:shadow-lg transition bg-white dark:bg-secondary-800 group">
                <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-secondary-700 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Testimonials */}
      <MotionSection initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="py-20 bg-gray-50 dark:bg-secondary-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv variants={fadeInUp(0)} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-gray-500 dark:text-gray-400">Real testimonials from real earners.</p>
          </MotionDiv>
          <MotionDiv variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <MotionDiv key={i} variants={staggerItem} className="bg-white dark:bg-secondary-800 p-6 rounded-2xl card-shadow">
                <div className="flex text-yellow-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <HiStar key={j} className="w-5 h-5" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-secondary-700 dark:text-white">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      {/* FAQ Section */}
      <MotionSection initial="initial" whileInView="animate" viewport={{ once: true }} className="py-20 bg-white dark:bg-secondary-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv variants={fadeInUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 dark:text-white mb-4">Frequently Asked Questions</h2>
          </MotionDiv>
          <MotionDiv variants={staggerContainer} className="space-y-4">
            {faqs.map((faq, i) => (
              <MotionDiv key={i} variants={staggerItem} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-secondary-800 transition">
                  <span className="font-medium text-secondary-700 dark:text-white">{faq.q}</span>
                  <HiChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <MotionDiv key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <p className="text-gray-500 dark:text-gray-400">{faq.a}</p>
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      {/* CTA Section */}
      <MotionSection initial="initial" whileInView="animate" viewport={{ once: true }} className="py-20 gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary-500 rounded-full blur-3xl"></div>
        </div>
        <MotionDiv variants={fadeInUp(0)} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">Join thousands of active earners. Complete simple tasks and earn real money every day!</p>
          <Link href="/register" className="inline-flex items-center gap-2 gradient-accent text-white px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition shadow-lg shadow-accent-500/25">
            Create Free Account <HiArrowRight className="w-5 h-5" />
          </Link>
        </MotionDiv>
      </MotionSection>

      {/* Contact Section */}
      <MotionSection initial="initial" whileInView="animate" viewport={{ once: true }} className="py-16 bg-gray-50 dark:bg-secondary-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv variants={fadeInUp(0)}>
            <h2 className="text-2xl font-bold text-secondary-700 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Have questions? We&apos;re here to help.</p>
          </MotionDiv>
          <MotionDiv variants={staggerContainer} className="grid md:grid-cols-3 gap-6">
            <MotionDiv variants={staggerItem} className="p-6 rounded-xl bg-white dark:bg-secondary-800 card-shadow">
              <p className="font-semibold text-secondary-700 dark:text-white">Email</p>
              <p className="text-gray-500 text-sm mt-1">support@taskearnpro.com</p>
            </MotionDiv>
            <MotionDiv variants={staggerItem} className="p-6 rounded-xl bg-white dark:bg-secondary-800 card-shadow">
              <p className="font-semibold text-secondary-700 dark:text-white">WhatsApp</p>
              <p className="text-gray-500 text-sm mt-1">+234 800 000 0000</p>
            </MotionDiv>
            <MotionDiv variants={staggerItem} className="p-6 rounded-xl bg-white dark:bg-secondary-800 card-shadow">
              <p className="font-semibold text-secondary-700 dark:text-white">Hours</p>
              <p className="text-gray-500 text-sm mt-1">Mon - Sat: 9AM - 6PM</p>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Footer */}
      <footer className="bg-secondary-700 dark:bg-secondary-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">&copy; 2026 TaskEarn Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
