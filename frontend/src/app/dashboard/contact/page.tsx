'use client';
import { HiMail, HiPhone, HiClock } from 'react-icons/hi';

export default function ContactPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-700 dark:text-white">Contact Us</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">We&apos;re here to help you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow text-center">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <HiMail className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-secondary-700 dark:text-white mb-2">Email</h3>
          <p className="text-gray-500 dark:text-gray-400">support@taskearnpro.com</p>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow text-center">
          <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <HiPhone className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-secondary-700 dark:text-white mb-2">WhatsApp</h3>
          <p className="text-gray-500 dark:text-gray-400">+234 800 000 0000</p>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow text-center">
          <div className="w-12 h-12 gradient-dark rounded-xl flex items-center justify-center mx-auto mb-4">
            <HiClock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-secondary-700 dark:text-white mb-2">Hours</h3>
          <p className="text-gray-500 dark:text-gray-400">Mon - Sat: 9AM - 6PM</p>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 card-shadow">
        <h2 className="text-lg font-semibold text-secondary-700 dark:text-white mb-4">Send Us a Message</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Your Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Enter your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Message</label>
            <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-secondary-700 text-secondary-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Write your message here..." />
          </div>
          <button type="submit" className="gradient-primary text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
